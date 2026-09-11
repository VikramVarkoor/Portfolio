'use client'

import { useState } from 'react'
import Gears from '../components/Gears'
import ProjectModal from '../components/ProjectModal'
import { useWipe } from '../components/WipeProvider'
import { projectMap, HARDWARE_LENS_IDS } from '../data'
import { trackProjectOpen, trackModeSwitch } from '../lib/analytics'

const SPEC_TAGS: Record<string, string> = {
  synapse: 'U01 · FPGA',
  powerquality: 'U02 · DSP',
  smartbin: 'U03 · COMPUTER VISION',
  syncrow: 'U04 · FIELD WORK',
}

const SPEC_SUMMARY: Record<string, string> = {
  synapse:
    'The hardware half: Vitis HLS kernels handle MRI feature-extraction directly in programmable logic on a Zynq-7020, which is what gets inference down to 17 seconds on a $269 board instead of a $3,000-10,000 GPU-equivalent setup. Vivado handled timing closure across the fabric, 100MHz clock (10.95ns actual vs. 15ns constraint) at 13% LUT / 22% DSP utilization, the part that decides whether a design survives contact with silicon.',
  powerquality:
    'Arduino-side signal acquisition feeding real-time FFT analysis, catching harmonic distortion and fault conditions as they happen, no cloud round-trip between the signal and the answer.',
  smartbin:
    'A MobileNet CNN fine-tuned to 97% Top-1 accuracy drives GPIO-controlled stepper and servo motors, closing the loop between camera inference and physical actuation, all running locally on a Raspberry Pi with no cloud dependency.',
  syncrow:
    '422 hours validating 15+ IoT device types against a 17-step testing procedure I designed, power-up through stress testing, across MQTT and ZigBee comms.',
}

export default function HardwarePage() {
  const { wipeNavigate } = useWipe()
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div id="hardware" className="lens-page">
      <div className="texture" />
      <Gears side="right" />
      <Gears side="left" />
      <div className="lens-nav">
        <span>VIKRAM VARKOOR</span>
        <button className="back" onClick={() => { trackModeSwitch('home'); wipeNavigate('/', 'home-wipe') }}>← back to overview</button>
      </div>
      <div className="lens-content">
        <div className="lens-kicker">Hardware Lens</div>
        <div className="lens-h1">How I build at the silicon level</div>
        <div className="lens-sub">
          Timing constraints, signal paths, and the physical limits of the boards these actually run on. The application layer sitting on top is one click away.
        </div>
        <div className="specsheet">
          {HARDWARE_LENS_IDS.map(id => {
            const p = projectMap[id]
            return (
              <div className="specrow" key={id}>
                <div className="corner l" />
                <div className="corner r" />
                <div className="tag">{SPEC_TAGS[id]}</div>
                <h3>{p.title}</h3>
                <p>{SPEC_SUMMARY[id]}</p>
                <div className="specs">
                  {p.tags.slice(0, 3).map(t => <span key={t}>{t}</span>)}
                </div>
                <button className="fulllink" onClick={() => { trackProjectOpen(id, 'hardware'); setOpenId(id) }}>
                  full breakdown
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>
      </div>
      <ProjectModal projectId={openId} onClose={() => setOpenId(null)} />
    </div>
  )
}
