import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/crm/primitives";
import { type Lead, type LeadStatus } from "@/data/crm";
import { Phone, PhoneOff, SkipForward, Mic, MicOff, ChevronRight, Building2 } from "lucide-react";
import { motion } from "framer-motion";

export type CallDisposition = "Connected" | "No Answer" | "Busy" | "Callback" | "Voicemail" | "Not Interested";

export interface CallLog {
  id: string;
  leadId: string;
  leadName: string;
  company: string;
  phone: string;
  disposition: CallDisposition;
  durationSeconds: number;
  notes: string;
  agent: string;
  timestamp: string;
  recordingUrl?: string;
}

interface AutoDialerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  queue: Lead[];
  initialIndex?: number;
  onCallLogged?: (log: CallLog, updatedLeadStatus?: LeadStatus) => void;
}

export function AutoDialerModal({ open, onOpenChange, queue, initialIndex = 0, onCallLogged }: AutoDialerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [callState, setCallState] = useState<"idle" | "dialing" | "connected" | "ended">("idle");
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedDisposition, setSelectedDisposition] = useState<CallDisposition>("Connected");
  const [callNotes, setCallNotes] = useState("");
  const [callbackDate, setCallbackDate] = useState("");
  const [callbackTime, setCallbackTime] = useState("");
  const [autoAdvance, setAutoAdvance] = useState(true);

  const currentLead = queue[currentIndex] || queue[0];

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Timer for active call
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState === "connected") {
      timer = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  // Start Call
  const handleStartCall = () => {
    setCallState("dialing");
    setCallDuration(0);
    setTimeout(() => {
      setCallState("connected");
    }, 1800);
  };

  // End Call
  const handleEndCall = () => {
    setCallState("ended");
  };

  // Submit Disposition & Log Call
  const handleCompleteCall = () => {
    if (!currentLead) return;

    let updatedStatus: LeadStatus | undefined;
    if (selectedDisposition === "Connected") updatedStatus = "Already Contacted";
    else if (selectedDisposition === "Callback") updatedStatus = "Call Back";
    else if (selectedDisposition === "Not Interested") updatedStatus = "Not Interested";
    else if (selectedDisposition === "No Answer" || selectedDisposition === "Busy") updatedStatus = "Already Contacted";

    const log: CallLog = {
      id: `CALL-${Date.now()}`,
      leadId: currentLead.id,
      leadName: currentLead.name,
      company: currentLead.company,
      phone: currentLead.phone,
      disposition: selectedDisposition,
      durationSeconds: callDuration,
      notes: callNotes || `Call completed with disposition: ${selectedDisposition}`,
      agent: currentLead.assigned || "Current Representative",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" }),
      recordingUrl: callDuration > 5 ? "https://actions.google.com/sounds/v1/ambiences/office_hubbub.ogg" : undefined,
    };

    if (onCallLogged) onCallLogged(log, updatedStatus);

    setCallState("idle");
    setCallDuration(0);
    setCallNotes("");

    if (autoAdvance && currentIndex < queue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (currentIndex >= queue.length - 1) {
      onOpenChange(false);
    }
  };

  const handleSkipLead = () => {
    setCallState("idle");
    setCallDuration(0);
    setCallNotes("");
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (!currentLead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden rounded-2xl border bg-card shadow-2xl">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-5 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-white">Integrated Auto Dialer & Softphone</DialogTitle>
                <DialogDescription className="text-xs text-white/80">
                  Lead Queue: {currentIndex + 1} of {queue.length} leads
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-xs text-white/90 cursor-pointer bg-white/10 px-2.5 py-1 rounded-lg">
                <input
                  type="checkbox"
                  checked={autoAdvance}
                  onChange={(e) => setAutoAdvance(e.target.checked)}
                  className="rounded border-white/30 text-primary"
                />
                Auto-Advance Queue
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="rounded-xl border bg-accent/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-primary font-bold">{currentLead.id}</span>
                <StatusBadge status={currentLead.status} />
              </div>
              <h3 className="font-display text-xl font-bold">{currentLead.name}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {currentLead.company}</span>
                <span>•</span>
                <span>Est. Value: AED {currentLead.dealValue?.toLocaleString()}</span>
              </p>
            </div>

            <div className="text-right">
              <p className="font-mono text-lg font-bold text-foreground">{currentLead.phone}</p>
              <p className="text-[11px] text-muted-foreground">Assigned: {currentLead.assigned}</p>
            </div>
          </div>

          <div className="rounded-2xl border p-5 text-center space-y-4 bg-card shadow-sm">
            {callState === "idle" && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Ready to dial lead number</p>
                <div className="flex justify-center gap-3">
                  <Button onClick={handleStartCall} className="rounded-xl h-11 px-6 bg-success text-success-foreground hover:bg-success/90 font-semibold shadow-md">
                    <Phone className="mr-2 h-5 w-5" /> Dial Now
                  </Button>
                  <Button variant="outline" onClick={handleSkipLead} className="rounded-xl h-11 px-4">
                    <SkipForward className="mr-1.5 h-4 w-4" /> Skip Lead
                  </Button>
                </div>
              </div>
            )}

            {callState === "dialing" && (
              <div className="space-y-3 py-2">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Phone className="h-8 w-8 animate-pulse" />
                </motion.div>
                <p className="text-sm font-bold text-primary">Ringing {currentLead.phone}…</p>
                <p className="text-xs text-muted-foreground">Initiating WebRTC Audio Session</p>
                <Button variant="destructive" size="sm" onClick={handleEndCall} className="rounded-xl">
                  Cancel Call
                </Button>
              </div>
            )}

            {callState === "connected" && (
              <div className="space-y-4 py-1">
                <div className="flex items-center justify-center gap-3">
                  <span className="flex h-3 w-3 rounded-full bg-success animate-ping" />
                  <p className="font-mono text-3xl font-extrabold text-foreground">{formatTime(callDuration)}</p>
                </div>
                <p className="text-xs font-semibold text-success uppercase tracking-wider">Live Call in Progress</p>

                <div className="flex justify-center gap-3 pt-2">
                  <Button variant={isMuted ? "destructive" : "outline"} size="icon" onClick={() => setIsMuted(!isMuted)} className="h-10 w-10 rounded-full">
                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  <Button variant="destructive" onClick={handleEndCall} className="rounded-xl h-10 px-6 font-semibold shadow-sm">
                    <PhoneOff className="mr-2 h-4 w-4" /> Hang Up Call
                  </Button>
                </div>
              </div>
            )}

            {callState === "ended" && (
              <div className="space-y-1 py-1">
                <p className="text-xs font-bold text-muted-foreground uppercase">Call Ended</p>
                <p className="font-mono text-xl font-bold">Duration: {formatTime(callDuration)}</p>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-2 border-t">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Call Disposition & Log Activity</h4>
            <div className="grid grid-cols-3 gap-2">
              {(["Connected", "No Answer", "Busy", "Callback", "Voicemail", "Not Interested"] as CallDisposition[]).map((disp) => (
                <Button
                  key={disp}
                  variant={selectedDisposition === disp ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDisposition(disp)}
                  className="rounded-xl text-xs h-9 justify-start"
                >
                  {disp}
                </Button>
              ))}
            </div>

            {selectedDisposition === "Callback" && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-xl">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground">Callback Date</label>
                  <Input type="date" value={callbackDate} onChange={(e) => setCallbackDate(e.target.value)} className="h-8 rounded-lg text-xs mt-1" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground">Time</label>
                  <Input type="time" value={callbackTime} onChange={(e) => setCallbackTime(e.target.value)} className="h-8 rounded-lg text-xs mt-1" />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-muted-foreground">Call Notes & Discussion Details</label>
              <Textarea
                rows={3}
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                placeholder="Enter client discussion summary, requirements, or next steps…"
                className="mt-1 rounded-xl text-xs resize-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-muted/40 p-4 flex items-center justify-between border-t">
          <Button variant="ghost" onClick={handleSkipLead} className="rounded-xl text-xs text-muted-foreground">
            Skip to Next Lead
          </Button>
          <Button onClick={handleCompleteCall} className="rounded-xl text-xs font-semibold px-6 shadow-sm">
            Save Log & Continue <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
