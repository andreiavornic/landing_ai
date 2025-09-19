// openai-rtc.service.ts
import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

export interface RTCConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  audioEnabled: boolean;
}

export interface OpenAIRealtimeEvent {
  type: string;
  data?: any;
}

interface ApiResponse {
  success: boolean;
  data: any;
  message?: any;
}

@Injectable({
  providedIn: 'root'
})
export class OpenAIRTCService {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private mediaStream: MediaStream | null = null;

  // State management
  private connectionStateSubject = new BehaviorSubject<RTCConnectionState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    audioEnabled: false
  });

  private eventsSubject = new BehaviorSubject<OpenAIRealtimeEvent | null>(null);

  public connectionState$: Observable<RTCConnectionState> = this.connectionStateSubject.asObservable();
  public events$: Observable<OpenAIRealtimeEvent | null> = this.eventsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.setupAudioElement();
  }

  private setupAudioElement(): void {
    this.audioElement = document.createElement('audio');
    this.audioElement.autoplay = true;
    this.audioElement.style.display = 'none';
    document.body.appendChild(this.audioElement);
  }

  getTokenOpenAI() {
    console.log(`environment.API_URL ${environment.API_URL}`)
    return this.http.get<ApiResponse>(environment.API_URL + 'api-web')
      .pipe(
        map(response => {
          if (response.success) {
            return response.data['client_secret']['value'];
          } else {
            throw response.message
          }
        })
      );
  }

  async connect(): Promise<void> {
    try {
      this.getTokenOpenAI()
        .subscribe(async (ephemeralKey) => {
          this.updateConnectionState({isConnecting: true, error: null});

          // const ephemeralKey = 'ek_68948b9564ec8191a5031905ca51d05b';

          // Configurează peer connection
          await this.setupPeerConnection();

          // Configurează audio input
          await this.setupAudioInput();

          // Configurează data channel
          this.setupDataChannel();

          // Stabilește conexiunea WebRTC
          await this.establishConnection(ephemeralKey);

          this.updateConnectionState({
            isConnected: true,
            isConnecting: false,
            audioEnabled: true
          });
        })
    } catch (error) {
      console.error('Eroare la conectarea OpenAI RTC:', error);
      this.updateConnectionState({
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Eroare necunoscută'
      });
      throw error;
    }
  }

  private async setupPeerConnection(): Promise<void> {
    this.pc = new RTCPeerConnection({
      iceServers: [
        {urls: 'stun:stun.l.google.com:19302'}
      ]
    });

    // Configurează event listeners pentru peer connection
    this.pc.onconnectionstatechange = () => {
      console.log('Connection state:', this.pc?.connectionState);
      if (this.pc?.connectionState === 'failed') {
        this.updateConnectionState({
          error: 'Conexiunea WebRTC a eșuat',
          isConnected: false,
          isConnecting: false
        });
      }
    };

    this.pc.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', this.pc?.iceConnectionState);
    };

    // Configurează audio output
    this.pc.ontrack = (event) => {
      console.log('Audio track primit:', event);
      if (this.audioElement && event.streams[0]) {
        this.audioElement.srcObject = event.streams[0];
      }
    };
  }

  private async setupAudioInput(): Promise<void> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 24000
        }
      });

      if (this.pc && this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => {
          this.pc!.addTrack(track, this.mediaStream!);
        });
      }
    } catch (error) {
      throw new Error(`Eroare la accesarea microfonului: ${error}`);
    }
  }

  private setupDataChannel(): void {
    if (!this.pc) return;

    this.dc = this.pc.createDataChannel('oai-events');

    this.dc.addEventListener('open', () => {
      console.log('Data channel deschis');
      // this.sendTextMessage("Start");
    });

    this.dc.addEventListener('message', (event) => {
      try {
        const eventData = JSON.parse(event.data);
        this.eventsSubject.next(eventData);
      } catch (error) {
        console.error('Eroare la parsarea evenimentului:', error);
        this.eventsSubject.next({
          type: 'error',
          data: {message: 'Eroare la parsarea mesajului', raw: event.data}
        });
      }
    });

    this.dc.addEventListener('error', (error) => {
      console.error('Eroare data channel:', error);
      this.updateConnectionState({
        error: 'Eroare la data channel'
      });
    });
  }

  private async establishConnection(ephemeralKey: string): Promise<void> {
    if (!this.pc) throw new Error('Peer connection nu este configurată');

    // Creează oferta SDP
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);

    // Trimite oferta către OpenAI
    const baseUrl = 'https://api.openai.com/v1/realtime';
    const model = 'gpt-4o-realtime-preview';

    const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
      method: 'POST',
      body: offer.sdp,
      headers: {
        'Authorization': `Bearer ${ephemeralKey}`,
        'Content-Type': 'application/sdp'
      }
    });


    if (!sdpResponse.ok) {
      throw new Error(`Eroare OpenAI API: ${sdpResponse.status} ${sdpResponse.statusText}`);
    }

    // Setează răspunsul SDP
    const answerSdp = await sdpResponse.text();
    const answer: RTCSessionDescriptionInit = {
      type: 'answer',
      sdp: answerSdp
    };


    await this.pc.setRemoteDescription(answer);
    // this.sendTextMessage("Start by introducing yourself to the user. Say who you are and what you can help with. Mention that the conversation will take place in English.");
    // await this.configureSession();
  }

  private async configureSession(): Promise<void> {
    const sessionConfig = {
      type: 'session.update',
      session: {
        instructions: "Ești un asistent vocal în română. Răspunde concis și prietenos. Folosește un ton conversațional și natural.",
        voice: 'ash', // sau 'echo', 'fable', 'onyx', 'nova', 'shimmer'
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: {
          model: 'whisper-1'
        },
        turn_detection: {
          // type: 'server_vad',
          // threshold: 0.5,
          // prefix_padding_ms: 300,
          // silence_duration_ms: 200
          type: 'semantic_vad',
          eagerness: 'medium',
        },
        tools: [], // adaugă tools dacă ai nevoie
        tool_choice: 'auto',
        temperature: 0.8,
        max_response_output_tokens: 4096
      }
    };

    // Trimite prin data channel sau WebSocket
    this.sendEvent(sessionConfig);
  }

  // Metodă pentru trimiterea de evenimente
  sendEvent(event: any): void {
    if (this.dc && this.dc.readyState === 'open') {
      this.dc.send(JSON.stringify(event));
    } else {
      console.warn('Data channel nu este disponibil pentru trimiterea evenimentelor');
    }
  }

  // Deconectare și cleanup
  disconnect(): void {
    if (this.dc) {
      this.dc.close();
      this.dc = null;
    }

    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    this.updateConnectionState({
      isConnected: false,
      isConnecting: false,
      error: null,
      audioEnabled: false
    });

    this.eventsSubject.next(null);
  }

  private updateConnectionState(updates: Partial<RTCConnectionState>): void {
    const currentState = this.connectionStateSubject.value;
    this.connectionStateSubject.next({...currentState, ...updates});
  }

  ngOnDestroy(): void {
     this.disconnect();
    if (this.audioElement) {
      document.body.removeChild(this.audioElement);
    }
  }

  canStartSession(): boolean {
    return this.dc !== null && this.dc.readyState === 'open';
  }


  sendTextMessage(text: string): void {
    console.log("sendTextMessage => Executed!");
    if (!this.canStartSession()) {
      console.warn('Nu se poate trimite mesajul - sesiunea nu este activă');
      return;
    }

    const messageEvent = {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text: text
          }
        ]
      }
    };

    this.sendEvent(messageEvent);

    // Trigger response
    const responseEvent = {
      type: "response.create",
      response: {
        modalities: ["text", "audio"]
      }
    };

    this.sendEvent(responseEvent);

    console.log(text);
    console.log(responseEvent);
  }


  // Control audio
  toggleMicrophone(): void {
    if (this.mediaStream) {
      const audioTrack = this.mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        this.updateConnectionState({
          audioEnabled: audioTrack.enabled
        });
      }
    }
  }

  setVolume(volume: number): void {
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(1, volume));
    }
  }

}
