import React, {useState, useEffect, useRef} from 'react'

export default function Recorder({onTranscript, inputLang}){
  const [recording, setRecording] = useState(false)
  const [supported, setSupported] = useState(true)
  const mediaRef = useRef(null)
  const recognitionRef = useRef(null)
  const chunksRef = useRef([])

  useEffect(()=>{
    // If Web Speech API is available, setup recognition as a convenience real-time demo.
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if(SpeechRecognition){
      const recog = new SpeechRecognition()
      recog.continuous = true
      recog.interimResults = false
      recog.lang = inputLang || 'en-US'
      recog.onresult = (e)=>{
        const t = Array.from(e.results).map(r=>r[0].transcript).join(' ')
        onTranscript(t, 'Patient')
      }
      recog.onerror = (err)=>{ console.warn('SpeechRecognition error', err) }
      recognitionRef.current = recog
    }else{
      // no web speech
      setSupported(false)
    }
  }, [inputLang, onTranscript])

  async function start(){
    setRecording(true)
    // Prefer Web Speech API for quick prototype
    if(recognitionRef.current){
      try{
        recognitionRef.current.lang = inputLang
        recognitionRef.current.start()
        return
      }catch(e){ console.warn(e) }
    }

    // Fallback to getUserMedia recording and local transcription via server
    try{
      const s = await navigator.mediaDevices.getUserMedia({audio:true})
      const mediaRecorder = new MediaRecorder(s)
      mediaRef.current = mediaRecorder
      mediaRecorder.ondataavailable = e => {
        chunksRef.current.push(e.data)
      }
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, {type:'audio/webm'})
        chunksRef.current = []
        // send blob to server STT endpoint
        const apiBase = import.meta.env.VITE_API_BASE || ''
        if(apiBase){
          const fd = new FormData()
          fd.append('audio', blob, 'chunk.webm')
          fd.append('lang', inputLang)
          try{
            const res = await fetch(`${apiBase}/stt`, {method:'POST', body:fd})
            const data = await res.json()
            onTranscript(data.transcript || '(no transcript)', 'Patient')
          }catch(e){
            console.error('stt error', e)
            onTranscript('(transcription failed)', 'Patient')
          }
        }else{
          onTranscript('(recorded audio - server not configured)', 'Patient')
        }
      }
      mediaRecorder.start()
    }catch(e){
      console.error(e)
      setRecording(false)
    }
  }

  function stop(){
    setRecording(false)
    if(recognitionRef.current){
      try{ recognitionRef.current.stop() }catch(e){}
    }
    if(mediaRef.current){
      try{ mediaRef.current.stop() }catch(e){}
    }
  }

  return (
    <div style={{display:'flex',gap:8,alignItems:'center',justifyContent:'space-between'}}>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <div style={{fontSize:13,color:'#9aa4b2'}}>Live capture</div>
        <div style={{fontSize:12,color:'#9aa4b2'}}>Speech recognition: {recognitionRef.current ? 'Web Speech API' : 'getUserMedia + server'}</div>
      </div>
      <div style={{display:'flex',gap:8}}>
        {!recording ? (
          <button onClick={start} className="start">Start</button>
        ):(
          <button onClick={stop} className="stop">Stop</button>
        )}
      </div>
    </div>
  )
}
