// Utility for customizable admin audio notification pings

let audioCtx: AudioContext | null = null;
let unlocked = false;

const SOUND_STORAGE_KEY = 'mamou_admin_sound_enabled';
const SOUND_TYPE_KEY = 'mamou_admin_sound_type';

export type SoundType = 'luxe_crystal' | 'soft_pop' | 'cash_register';

export const SOUND_OPTIONS: { id: SoundType; label: string; description: string }[] = [
  { id: 'luxe_crystal', label: '💎 Cristal Luxe', description: 'Carillon très doux, élégant et cristallin' },
  { id: 'soft_pop', label: '🔔 Pop Discret', description: 'Bulle sonore douce et discrète' },
  { id: 'cash_register', label: '💰 Caisse Shopify', description: 'Double son d\'encaissement traditionnel' },
];

/**
 * Check if sound notifications are enabled in settings (default true)
 */
export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(SOUND_STORAGE_KEY);
  return stored !== 'false';
}

/**
 * Set sound notifications preference
 */
export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SOUND_STORAGE_KEY, String(enabled));
}

/**
 * Get selected sound type (default 'luxe_crystal')
 */
export function getSoundType(): SoundType {
  if (typeof window === 'undefined') return 'luxe_crystal';
  const stored = localStorage.getItem(SOUND_TYPE_KEY) as SoundType;
  return (stored && SOUND_OPTIONS.some(o => o.id === stored)) ? stored : 'luxe_crystal';
}

/**
 * Set selected sound type
 */
export function setSoundType(type: SoundType): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SOUND_TYPE_KEY, type);
}

/**
 * Initialize and unlock Web Audio Context on first user interaction
 */
export function unlockAudioContext(): void {
  if (typeof window === 'undefined') return;
  if (unlocked && audioCtx && audioCtx.state === 'running') return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume().then(() => {
        unlocked = true;
      });
    } else {
      unlocked = true;
    }
  } catch (e) {
    console.warn('Could not unlock AudioContext:', e);
  }
}

/**
 * Play order notification sound by sound type
 */
export function playOrderPingSound(customType?: SoundType): void {
  if (typeof window === 'undefined') return;
  if (!customType && !isSoundEnabled()) return;

  try {
    unlockAudioContext();

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const soundType = customType || getSoundType();
    const now = audioCtx.currentTime;

    if (soundType === 'luxe_crystal') {
      // Very soft, elegant crystal glass bell (C5 -> C6)
      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.2, now);
      masterGain.connect(audioCtx.destination);

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15); // C6

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.5, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.9);

      // Layered harmonic ring
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1567.98, now + 0.05); // G6

      gain2.gain.setValueAtTime(0, now + 0.05);
      gain2.gain.linearRampToValueAtTime(0.25, now + 0.07);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc2.start(now + 0.05);
      osc2.stop(now + 1.1);

    } else if (soundType === 'soft_pop') {
      // Soft gentle bubble pop
      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.25, now);
      masterGain.connect(audioCtx.destination);

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.6, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.25);

    } else if (soundType === 'cash_register') {
      // Traditional dual cash register chime
      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.3, now);
      masterGain.connect(audioCtx.destination);

      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, now);
      osc1.frequency.exponentialRampToValueAtTime(1318.51, now + 0.12);

      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.7, now + 0.015);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gain1);
      gain1.connect(masterGain);
      osc1.start(now);
      osc1.stop(now + 0.5);

      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1318.51, now + 0.08);

      gain2.gain.setValueAtTime(0, now + 0.08);
      gain2.gain.linearRampToValueAtTime(0.5, now + 0.095);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.7);
    }
  } catch (err) {
    console.error('Error playing order notification ping:', err);
  }
}
