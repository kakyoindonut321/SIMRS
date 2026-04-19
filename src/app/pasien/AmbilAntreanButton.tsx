'use client'

import { useState } from 'react'
import { ambilAntrean } from './actions'
import { useRouter } from 'next/navigation'

export default function AmbilAntreanButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleAmbil = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await ambilAntrean()
      if (res?.error) {
        setError(res.error)
        alert(res.error)
      } else {
        router.refresh()
      }
    } catch (e: any) {
      setError('Kesalahan sistem: ' + e.message)
    }
    setLoading(false)
  }

  return (
    <>
      <button 
        onClick={handleAmbil} 
        disabled={loading}
        className="btn btn-primary mt-4"
      >
        {loading ? 'Memproses...' : 'Cetak Tiket Antrean'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </>
  )
}
