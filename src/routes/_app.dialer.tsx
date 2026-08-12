import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, KpiCard, StatusBadge } from "@/components/crm/primitives";
import { LEADS, type Lead } from "@/data/crm";
import { AutoDialerModal, type CallLog, type CallDisposition } from "@/components/crm/auto-dialer-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Phone, PhoneCall, Play, Pause, Clock, CheckCircle2, XCircle, Volume2, UserCheck, Calendar, Filter, Search, Sparkles, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/_app/dialer")({
  head: () => ({ meta: [{ title: "Auto Dialer & Call Center Analytics — AY Astute Group CRM" }] }),
  component: DialerPage,
});

const INITIAL_LOGS: CallLog[] = [
  {
    id: "CALL-901",
    leadId: "LEAD-2001",
    leadName: "Ahmed Al Mansoori",
    company: "LuLu Group",
    phone: "+971 50 100 1000",
    disposition: "Connected",
    durationSeconds: 245,
    notes: "Discussed Statutory Audit scope for FY 2026. Client requested formal fee proposal.",
    agent: "Priya Menon",
    timestamp: "2026-08-11 10:15 AM",
    recordingUrl: "https://actions.google.com/sounds/v1/ambiences/office_hubbub.ogg",
  },
  {
    id: "CALL-902",
    leadId: "LEAD-2002",
    leadName: "Fatima Al Maktoum",
    company: "Komatsu ME",
    phone: "+971 51 201 3003",
    disposition: "Callback",
    durationSeconds: 42,
    notes: "Client in board meeting. Requested callback tomorrow at 2:00 PM.",
    agent: "Rahul Sharma",
    timestamp: "2026-08-11 09:45 AM",
  },
  {
    id: "CALL-903",
    leadId: "LEAD-2003",
    leadName: "Mohammed Al Nahyan",
    company: "J.S. Lootah",
    phone: "+971 52 202 3006",
    disposition: "No Answer",
    durationSeconds: 15,
    notes: "No answer after 5 rings. Queued for evening retry.",
    agent: "Anita Desai",
    timestamp: "2026-08-11 09:20 AM",
  },
  {
    id: "CALL-904",
    leadId: "LEAD-2004",
    leadName: "Aisha Al Qassimi",
    company: "LoneStar Group",
    phone: "+971 53 203 3009",
    disposition: "Connected",
    durationSeconds: 310,
    notes: "Corporate tax impact analysis review. Scheduled follow-up meeting.",
    agent: "Kareem Ali",
    timestamp: "2026-08-10 04:30 PM",
    recordingUrl: "https://actions.google.com/sounds/v1/ambiences/office_hubbub.ogg",
  },
];

function DialerPage() {
  const [callLogs, setCallLogs] = useState<CallLog[]>(INITIAL_LOGS);
  const [dialerOpen, setDialerOpen] = useState(false);
  const [activeQueue, setActiveQueue] = useState<Lead[]>(LEADS);
  const [selectedQueueFilter, setSelectedQueueFilter] = useState("All");
  const [playingRecordingId, setPlayingRecordingId] = useState<string | null>(null);

  // Handle call logged from modal
  const handleCallLogged = (newLog: CallLog) => {
    setCallLogs([newLog, ...callLogs]);
  };

  // Start Auto Dialer with filtered queue
  const handleLaunchDialer = (filter: string = "All") => {
    let queue = LEADS;
    if (filter === "Hot Follow-up") queue = LEADS.filter((l) => l.status === "Hot Follow-up");
    else if (filter === "Call Back") queue = LEADS.filter((l) => l.status === "Call Back");
    else if (filter === "Not Contacted") queue = LEADS.filter((l) => l.status === "Not Contacted");
    setActiveQueue(queue.length > 0 ? queue : LEADS);
    setDialerOpen(true);
  };

  const totalCalls = callLogs.length;
  const connectedCalls = callLogs.filter((c) => c.disposition === "Connected").length;
  const connectRate = totalCalls > 0 ? Math.round((connectedCalls / totalCalls) * 100) : 0;
  const totalSeconds = callLogs.reduce((acc, c) => acc + c.durationSeconds, 0);
  const totalMinutes = Math.round(totalSeconds / 60);

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Integrated Auto Dialer & Call Center"
        subtitle="Automated lead dialing queue, click-to-call softphone, dispositions, and call recording analytics."
        actions={
          <Button onClick={() => handleLaunchDialer(selectedQueueFilter)} className="rounded-xl shadow-md font-semibold bg-primary">
            <PhoneCall className="mr-2 h-4 w-4" /> Launch Auto Dialer Queue
          </Button>
        }
      />

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Calls Logged" value={totalCalls} delta="+14% vs yesterday" tone="primary" icon={PhoneCall} />
        <KpiCard label="Call Connect Rate" value={`${connectRate}%`} delta="Optimal conversion range" tone="success" icon={UserCheck} />
        <KpiCard label="Total Talk Time" value={`${totalMinutes} mins`} delta="Avg 3.4 mins / call" tone="info" icon={Clock} />
        <KpiCard label="Callbacks Scheduled" value={callLogs.filter((c) => c.disposition === "Callback").length} delta="Action required today" tone="warning" icon={Calendar} />
      </div>

      {/* Queue Launcher Panel */}
      <div className="mt-6 rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
          <div>
            <h3 className="font-display text-lg font-bold">Auto Dialer Queue Launcher</h3>
            <p className="text-xs text-muted-foreground">Select lead group to automatically dial sequentially</p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={selectedQueueFilter} onValueChange={setSelectedQueueFilter}>
              <SelectTrigger className="w-[200px] rounded-xl text-xs">
                <SelectValue placeholder="Select Queue Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Leads ({LEADS.length})</SelectItem>
                <SelectItem value="Not Contacted">Not Contacted</SelectItem>
                <SelectItem value="Hot Follow-up">Hot Follow-up</SelectItem>
                <SelectItem value="Call Back">Call Backs</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => handleLaunchDialer(selectedQueueFilter)} className="rounded-xl text-xs font-semibold">
              <Play className="mr-1.5 h-3.5 w-3.5" /> Start Queue
            </Button>
          </div>
        </div>

        {/* Live Call Logs Table */}
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Lead Name</TableHead>
                <TableHead className="font-semibold">Company</TableHead>
                <TableHead className="font-semibold">Phone</TableHead>
                <TableHead className="font-semibold">Disposition</TableHead>
                <TableHead className="font-semibold">Duration</TableHead>
                <TableHead className="font-semibold">Agent</TableHead>
                <TableHead className="font-semibold">Timestamp</TableHead>
                <TableHead className="font-semibold text-right">Recording</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {callLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-accent/40 transition">
                  <TableCell>
                    <p className="text-sm font-semibold">{log.leadName}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{log.leadId}</p>
                  </TableCell>
                  <TableCell className="text-xs">{log.company}</TableCell>
                  <TableCell className="text-xs font-mono">{log.phone}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                        log.disposition === "Connected"
                          ? "bg-success-soft text-success border-success/20"
                          : log.disposition === "Callback"
                          ? "bg-warning-soft text-warning border-warning/20"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {log.disposition}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    {Math.floor(log.durationSeconds / 60)}m {log.durationSeconds % 60}s
                  </TableCell>
                  <TableCell className="text-xs font-medium">{log.agent}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{log.timestamp}</TableCell>
                  <TableCell className="text-right">
                    {log.recordingUrl ? (
                      <Button
                        size="sm"
                        variant={playingRecordingId === log.id ? "default" : "outline"}
                        onClick={() => setPlayingRecordingId(playingRecordingId === log.id ? null : log.id)}
                        className="rounded-lg h-8 text-xs"
                      >
                        {playingRecordingId === log.id ? (
                          <>
                            <Pause className="mr-1 h-3.5 w-3.5" /> Playing…
                          </>
                        ) : (
                          <>
                            <Play className="mr-1 h-3.5 w-3.5" /> Listen
                          </>
                        )}
                      </Button>
                    ) : (
                      <span className="text-[11px] text-muted-foreground italic">No Audio</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Auto Dialer Softphone Modal */}
      <AutoDialerModal
        open={dialerOpen}
        onOpenChange={setDialerOpen}
        queue={activeQueue}
        onCallLogged={handleCallLogged}
      />
    </div>
  );
}
