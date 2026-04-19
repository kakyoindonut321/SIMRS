'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getUserSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('auth_user')
  if (!session) return null
  try {
    return JSON.parse(session.value)
  } catch {
    return null
  }
}

export async function logoutUser() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_user')
  redirect('/')
}

export async function ambilAntrean() {
  const session = await getUserSession()
  if (!session || session.role !== 'PASIEN') {
    return { error: 'Anda tidak memiliki akses.' }
  }

  try {
    // 1. Dapatkan pasienId dari userId
    const pasien = await prisma.pasien.findUnique({
      where: { userId: session.id }
    })

    if (!pasien) {
      return { error: 'Data detail pasien belum lengkap.' }
    }

    const todayUTC = new Date(new Date().toISOString().split('T')[0] + 'T00:00:00.000Z');

    const existingAntrean = await prisma.antrean.findFirst({
      where: {
        pasienId: pasien.id,
        tanggal: todayUTC
      }
    })

    if (existingAntrean) {
      return { error: 'Anda sudah mengambil antrean hari ini.' }
    }

    // Hitung nomor antrean terakhir hari ini untuk menentukan nomor antrean selanjutnya
    const antreanCount = await prisma.antrean.count({
      where: {
        tanggal: todayUTC
      }
    })

    // 3. Buat antrean baru
    await prisma.antrean.create({
      data: {
        pasienId: pasien.id,
        tanggal: new Date(),
        noAntrean: antreanCount + 1,
        status: 'MENUNGGU'
      }
    })

    revalidatePath('/pasien')
    return { success: true }
  } catch (error: any) {
    console.error("Antrean error:", error);
    return { error: 'Gagal mengambil antrean: ' + error.message }
  }
}
