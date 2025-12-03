import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hyodocare.app',
  appName: '효도청약',
  webDir: 'dist', // 이건 그냥 둡니다 (형식상 필요)
  server: {
    // 🚨 여기에 승환님이 배포한 실제 웹사이트 주소를 적으세요!
    url: 'https://www.hyodo-care.com', 
    
    // 안드로이드 스튜디오 에뮬레이터에서 http(로컬) 테스트할 때 필요
    cleartext: true 
  }
};

export default config;
