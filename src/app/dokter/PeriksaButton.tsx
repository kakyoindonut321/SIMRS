'use client'

import { useState } from 'react'
import { periksaPasien } from './actions'

export default function PeriksaButton({ antreanId }: { antreanId: number }) {
  const [loading, setLoading] = useState(false)

  const handlePeriksa = async () => {
    setLoading(true)
    const res = await periksaPasien(antreanId)
    if (res?.error) {
      alert(res.error)
    }
    setLoading(false)
  }

  return (
    <button 
      onClick={handlePeriksa} 
      className="btn btn-primary" 
      style={{ padding: "6px 12px", fontSize: "14px", border: "none" }}
      disabled={loading}
    >
      {loading ? 'Menyimpan...' : 'Periksa Pasien'}
    </button>
  )
}
