'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getUserSession } from '../pasien/actions'

export async function periksaPasien(antreanId: number) {
  const session = await getUserSession()
  if (!session || session.role !== 'DOKTER') {
    return { error: 'Akses ditolak. Hanya dokter yang diizinkan.' }
  }

  try {
    await prisma.antrean.update({
      where: { id: antreanId },
      data: { status: 'DIPERIKSA' }
    })
    
    // Refresh halaman dokter
    revalidatePath('/dokter')
    return { success: true }
  } catch (err) {
    return { error: 'Gagal merubah status pasien.' }
  }
}
