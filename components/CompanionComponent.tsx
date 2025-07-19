"use client";
import { cn, configureAssistant, getSubjectColor } from "@/lib/utils";
import { vapi } from "@/lib/vapi";
import { CompanionComponentProps, SavedMessage } from "@/types";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import soundWave from "@/constants/soundwaves.json";
import { addToSessionHistory } from "@/lib/actions/companions.actions";
// import Message from "@vapi-ai/web";

enum CallStatus {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
  CONNECTING = "CONNECTING",
  FINISHED = "FINISHED",
}

const CompanionComponent = ({
  companionId,
  userImage,
  userName,
  subject,
  topic,
  voice,
  style,
  name,
}: CompanionComponentProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  useEffect(() => {
    if (lottieRef.current) {
      if (isSpeaking) {
        lottieRef.current?.play();
      } else {
        lottieRef.current?.stop();
      }
    }
  }, [isSpeaking]);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);

    const onEnd = async () => {
      setCallStatus(CallStatus.FINISHED);

      try {
        await addToSessionHistory(companionId);
      } catch (error) {
        toast.error("error: " + error);
      }
    };

    const onMessage = (message: Message) => {
      if (message.type == "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [newMessage, ...prev]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);

    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => {
      toast.error("error: " + error.message);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onEnd);
    vapi.on("message", onMessage);
    vapi.on("error", onError);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onEnd);
      vapi.off("message", onMessage);
      vapi.off("error", onError);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
    };
  }, []);

  const toggleMic = () => {
    const isMuted = vapi.isMuted();
    vapi.setMuted(!isMuted);
    setIsMuted(!isMuted);
  };

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    const assistantOverrides = {
      variableValues: {
        topic,
        subject,
        style,
      },
      clientMessages: ["transcript"],
      serverMessages: [],
    };

    // @ts-expect-error - VAPI types are not fully typed
    vapi.start(configureAssistant(voice, style), assistantOverrides);
  };

  const handleDisconnect = () => {
    vapi.stop();
    setCallStatus(CallStatus.FINISHED);
  };

  return (
    <section className="flex flex-col h-[95vh]">
      <section className="flex max-md:flex-col gap-8 max-md:items-center">
        <div className="companion-section">
          <div
            style={{ backgroundColor: getSubjectColor(subject) }}
            className="companion-avatar"
          >
            <Image
              src={`/icons/${subject}.svg`}
              alt={name}
              width={150}
              height={150}
              className="max-sm:w-fit"
            />
          </div>
          <div
            className={cn(
              "transition-opacity duration-1000 absolute",
              callStatus === CallStatus.INACTIVE ||
                callStatus === CallStatus.FINISHED
                ? "opacity-0"
                : "opacity-100",
              callStatus === CallStatus.CONNECTING &&
                "animate-pulse opacity-100"
            )}
          >
            {soundWave && (
              <Lottie
                className="companion-lottie"
                animationData={soundWave}
                loop={true}
                autoplay={false}
                lottieRef={lottieRef}
              />
            )}
          </div>
          <p className="font-bold text-2xl">{name}</p>
        </div>
        <div className="user-section">
          <div className="user-avatar">
            <Image
              src={userImage}
              alt={userName}
              width={130}
              height={130}
              className="rounded-lg"
            />
            <p className="text-xl">{userName}</p>
          </div>
          <button
            className="btn-mic"
            onClick={toggleMic}
            disabled={callStatus !== CallStatus.ACTIVE}
          >
            <Image
              src={`/icons/${isMuted ? "mic-off" : "mic-on"}.svg`}
              alt="mic"
              width={36}
              height={36}
            />
            <p>{isMuted ? "Turn on mic" : "Turn off mic"}</p>
          </button>

          <button
            className={cn(
              "rounded-lg p-2 cursor-pointer transition-color w-full text-white",
              callStatus === CallStatus.ACTIVE ? "bg-red-500" : "bg-primary",
              callStatus === CallStatus.CONNECTING && "animate-pulse"
            )}
            onClick={
              callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall
            }
          >
            {callStatus === CallStatus.ACTIVE
              ? "End Call"
              : callStatus === CallStatus.CONNECTING
              ? "Connecting..."
              : "Start Call"}
          </button>
        </div>
      </section>
      <section className="transcript">
        <div className="transcript-message no-scrollbar">
          {messages.map((message, index) => {
            if (message.role == "assistant") {
              return (
                <p
                  key={index}
                  className="max-sm:text-sm text-xl rounded-2xl"
                  style={{
                    backgroundColor: getSubjectColor(subject),
                  }}
                >
                  {name.split(" ")[0]}: {message.content}
                </p>
              );
            } else {
              return (
                <p key={index} className="text-primary max-sm:text-sm text-xl">
                  {userName.split(" ")[0]}: {message.content}
                </p>
              );
            }
          })}
        </div>
        <div className="transcript-fade" />
      </section>
    </section>
  );
};

export default CompanionComponent;
