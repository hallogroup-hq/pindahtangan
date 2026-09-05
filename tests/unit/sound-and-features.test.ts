import { describe, it, expect, beforeEach } from 'vitest';
import { getStore } from '@/lib/store';
import { sound } from '@/lib/sound';

describe('REG-FEATURES: Sound, Referral, Auth & Webhooks', () => {
  beforeEach(() => {
    getStore().resetToDefault();
  });

  describe('1. Web Audio Sound Engine', () => {
    it('REG-SND-01: can mute and unmute audio cleanly', () => {
      expect(sound.getMuted()).toBe(false);
      sound.setMuted(true);
      expect(sound.getMuted()).toBe(true);
      sound.setMuted(false);
      expect(sound.getMuted()).toBe(false);
    });

    it('REG-SND-02: execution of audio cues does not throw errors even in headless environment', () => {
      expect(() => {
        sound.playSuccessBeep();
        sound.playErrorBuzzer();
        sound.playSoldCheer();
        sound.playGongDeal();
        sound.playCountdownTick();
      }).not.toThrow();
    });
  });

  describe('2. Consignor Referral & Loyalty Engine', () => {
    it('REG-REF-01: auto-credits Rp 10.000 referral bonus to referring neighbor', () => {
      const store = getStore();
      const initialRatnaBonus = store.getData().profiles.find((p) => p.id === 'user-ratna-01')?.referral_bonus_earned || 0;

      // New neighbor books using Ratna's referral code 'RATNA-SKB'
      const { batch, consignor } = store.bookIntakeBatch({
        consignorName: 'Ibu Nenden Sukabumi',
        phoneNumber: '0857-9988-1122',
        pickupAddress: 'Jl. Surya Kencana No. 80',
        district: 'Kecamatan Cikole',
        pickupDate: '2026-09-12',
        estimatedCount: 25,
        referralCode: 'RATNA-SKB',
      });

      expect(batch.referral_code).toBe('RATNA-SKB');
      expect(consignor.referred_by).toBe('user-ratna-01');

      const updatedRatna = store.getData().profiles.find((p) => p.id === 'user-ratna-01');
      expect(updatedRatna?.referral_bonus_earned).toBe(initialRatnaBonus + 10000);
    });

    it('REG-REF-02: generates unique referral code for newly registered consignors', () => {
      const store = getStore();
      const profile = store.createOrGetProfile({
        fullName: 'Aminah Sukabumi',
        phoneNumber: '0812-7777-8888',
      });

      expect(profile.referral_code).toBeDefined();
      expect(profile.referral_code).toContain('AMINAH-');
    });
  });

  describe('3. User Authentication & Profile Management', () => {
    it('REG-AUTH-01: createOrGetProfile returns existing profile if phone matches', () => {
      const store = getStore();
      const profile = store.createOrGetProfile({
        fullName: 'Ratna Dewi Mutate',
        phoneNumber: '0812-8899-7711', // Matches Ibu Ratna Dewi
      });

      expect(profile.id).toBe('user-ratna-01');
      expect(profile.full_name).toBe('Ibu Ratna Dewi');
    });

    it('REG-AUTH-02: createOrGetProfile creates new profile if phone is not registered', () => {
      const store = getStore();
      const initialCount = store.getData().profiles.length;

      const profile = store.createOrGetProfile({
        fullName: 'Bapak Hendra Cikole',
        phoneNumber: '0819-0011-2233',
        role: 'consignor',
      });

      expect(profile.id).toBeDefined();
      expect(profile.full_name).toBe('Bapak Hendra Cikole');
      expect(store.getData().profiles.length).toBe(initialCount + 1);
    });
  });
});
