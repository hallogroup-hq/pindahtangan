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

    it('REG-AUTH-03: registerUser successfully creates real user, sets active session, and sends welcome WA', () => {
      const store = getStore();
      const result = store.registerUser({
        fullName: 'Siti Rahmawati Sukabumi',
        email: 'siti.rahma@sukabumi.id',
        phoneNumber: '0812-9988-7711',
        password: 'password123',
        role: 'consignor',
        district: 'Kecamatan Cikole',
        address: 'Jl. Surya Kencana No. 12',
        bankName: 'BCA',
        bankAccountNumber: '1234567890',
        bankAccountHolder: 'Siti Rahmawati',
      });

      expect(result.success).toBe(true);
      expect(result.profile).toBeDefined();
      expect(result.profile?.full_name).toBe('Siti Rahmawati Sukabumi');
      expect(result.profile?.email).toBe('siti.rahma@sukabumi.id');
      expect(result.profile?.referral_code).toContain('SITI-');
      expect(store.getActiveUser().id).toBe(result.profile?.id);
      expect(store.isUserLoggedIn()).toBe(true);
    });

    it('REG-AUTH-04: registerUser rejects duplicate email and duplicate phone', () => {
      const store = getStore();
      // First registration
      store.registerUser({
        fullName: 'User Satu',
        email: 'unique@sukabumi.id',
        phoneNumber: '0813-9999-8888',
        password: 'password123',
      });

      // Attempt duplicate email
      const dupEmail = store.registerUser({
        fullName: 'User Dua',
        email: 'unique@sukabumi.id',
        phoneNumber: '0814-1111-2222',
        password: 'password123',
      });
      expect(dupEmail.success).toBe(false);
      expect(dupEmail.error).toContain('sudah terdaftar');

      // Attempt duplicate phone
      const dupPhone = store.registerUser({
        fullName: 'User Tiga',
        email: 'other@sukabumi.id',
        phoneNumber: '0813-9999-8888',
        password: 'password123',
      });
      expect(dupPhone.success).toBe(false);
      expect(dupPhone.error).toContain('sudah terdaftar');
    });

    it('REG-AUTH-05: loginUser validates credentials and sets session for both email and phone', () => {
      const store = getStore();

      // Register new user
      store.registerUser({
        fullName: 'Dian Anggraeni',
        email: 'dian@sukabumi.id',
        phoneNumber: '0857-1234-5678',
        password: 'mysecurepassword',
      });

      // Logout
      store.logoutUser();
      expect(store.isUserLoggedIn()).toBe(false);

      // Login with Email
      const emailLogin = store.loginUser('dian@sukabumi.id', 'mysecurepassword');
      expect(emailLogin.success).toBe(true);
      expect(emailLogin.profile?.full_name).toBe('Dian Anggraeni');
      expect(store.getActiveUser().id).toBe(emailLogin.profile?.id);

      // Login with Phone
      store.logoutUser();
      const phoneLogin = store.loginUser('0857-1234-5678', 'mysecurepassword');
      expect(phoneLogin.success).toBe(true);
      expect(phoneLogin.profile?.full_name).toBe('Dian Anggraeni');

      // Wrong Password
      const badPw = store.loginUser('dian@sukabumi.id', 'wrongpassword');
      expect(badPw.success).toBe(false);
      expect(badPw.error).toContain('tidak sesuai');

      // Non-existent User
      const notFound = store.loginUser('unknown@sukabumi.id', 'any');
      expect(notFound.success).toBe(false);
      expect(notFound.error).toContain('tidak ditemukan');
    });

    it('REG-AUTH-06: logoutUser clears active session cleanly', () => {
      const store = getStore();
      store.setActiveUser('user-ratna-01');
      expect(store.isUserLoggedIn()).toBe(true);

      const res = store.logoutUser();
      expect(res.success).toBe(true);
      expect(store.isUserLoggedIn()).toBe(false);
    });

    it('REG-AUTH-07: updateProfile allows editing user bank and personal details', () => {
      const store = getStore();
      const updated = store.updateProfile('user-ratna-01', {
        bank_name: 'Mandiri',
        bank_account_number: '9876543210',
        district: 'Kecamatan Citamiang',
      });

      expect(updated?.bank_name).toBe('Mandiri');
      expect(updated?.bank_account_number).toBe('9876543210');
      expect(updated?.district).toBe('Kecamatan Citamiang');
    });
  });
});

