/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ANGULAR_COMPONENT_TS,
  ANGULAR_COMPONENT_HTML,
  ANGULAR_COMPONENT_CSS,
} from './angular-code';

interface AuditRecord {
  id: string;
  series: string;
  algorithm: string;
  score: string;
  isPassing: boolean;
  date: string;
  ecus: string;
}

interface TaskQueueItem {
  id: string;
  title: string;
  status: 'QUEUED' | 'VERIFYING' | 'COMPLETED';
  lineCell: string;
  countdown: string;
  engineer: string;
  roleTag: string;
  jobCode: string;
}

export default function App() {
  // Navigation & View Mode
  const [activeNav, setActiveNav] = useState<'cluster' | 'pipelines' | 'telemetry' | 'security' | 'nodes'>('cluster');
  const [viewMode, setViewMode] = useState<'both' | 'auth' | 'dash'>('both');
  const [searchQuery, setSearchQuery] = useState('');
  const [syncCount, setSyncCount] = useState(0.4);

  // Authentication form state
  const [username, setUsername] = useState('f.weber@bmwgroup.net');
  const [departmentCode, setDepartmentCode] = useState('FG-9-ZA-72');
  const [selectedRole, setSelectedRole] = useState('DevOps Cluster Administrator (Full Access)');
  const [rememberWorkstation, setRememberWorkstation] = useState(true);
  const [authSuccessToast, setAuthSuccessToast] = useState(false);

  // System controls toggles
  const [clusterFailover, setClusterFailover] = useState(false);
  const [ingressThrottling, setIngressThrottling] = useState(true);
  const [emergencyLockdownArmed, setEmergencyLockdownArmed] = useState(false);

  // Active flash progress simulation
  const [flashProgress, setFlashProgress] = useState(74);
  const [currentBlock, setCurrentBlock] = useState(4112);
  const totalBlocks = 5556;
  const [eta, setEta] = useState(42);

  // Filter tabs for Audits
  const [selectedAuditTab, setSelectedAuditTab] = useState<'all' | 'ota' | 'safety' | 'ecu'>('all');

  // Modals state
  const [modalType, setModalType] = useState<'action' | 'lockdown' | 'hotfix' | 'inspect' | 'angular' | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDesc, setModalDesc] = useState('');
  const [selectedAudit, setSelectedAudit] = useState<AuditRecord | null>(null);

  // Angular Code viewer state
  const [angularTab, setAngularTab] = useState<'ts' | 'html' | 'css' | 'guide'>('ts');
  const [copySuccess, setCopySuccess] = useState(false);

  // Dynamic audit items
  const [audits] = useState<AuditRecord[]>([
    {
      id: '#AUD-BMW-9841',
      series: 'G70 / i7 xDrive60',
      algorithm: 'Ed25519-HSM',
      score: '100.0%',
      isPassing: true,
      date: '2025-05-18 08:42:10 UTC',
      ecus: 'Drive-Unit-X, Battery-Management, Head-Unit'
    },
    {
      id: '#AUD-BMW-9840',
      series: 'G05 / X5 xDrive50e',
      algorithm: 'ECDSA P-384',
      score: '99.4%',
      isPassing: true,
      date: '2025-05-18 07:19:55 UTC',
      ecus: 'Hybrid-Supervisory-Controller, Transmission-ECU'
    },
    {
      id: '#AUD-BMW-9839',
      series: 'G20 / 330e Hybrid',
      algorithm: 'RSA-PSS-4096',
      score: '98.9%',
      isPassing: true,
      date: '2025-05-18 06:05:12 UTC',
      ecus: 'Comfort-CAN-Gateway, Telematics-Box-High'
    }
  ]);

  // Queue items
  const [queueItems, setQueueItems] = useState<TaskQueueItem[]>([
    {
      id: 'task-1',
      title: 'Robotics Actuator Calibration v2.1',
      status: 'QUEUED',
      lineCell: 'Line Cell 09 · KUKA KR-1000 Arm Cluster',
      countdown: 'T-00:03:15',
      engineer: 'M. Hofer',
      roleTag: 'ROB-OPS',
      jobCode: '#JOB-ROB-4921'
    },
    {
      id: 'task-2',
      title: 'LiDAR Telemetry Diagnostics Streamer',
      status: 'VERIFYING',
      lineCell: 'Test Rig Dingolfing #02 · Autonomous Staging',
      countdown: 'T-00:11:40',
      engineer: 'Dr. F. Weber',
      roleTag: 'ARCH',
      jobCode: '#JOB-LID-1108'
    },
    {
      id: 'task-3',
      title: 'High-Voltage Battery BMS Flasher',
      status: 'COMPLETED',
      lineCell: 'Line 02 · BMW iX xDrive50 Series',
      countdown: 'SUCCESS (0.8s)',
      engineer: 'K. Lindner',
      roleTag: 'BMS-QA',
      jobCode: '#JOB-BMS-0941'
    }
  ]);

  // New hotfix input
  const [newHotfixTitle, setNewHotfixTitle] = useState('');
  const [newHotfixCell, setNewHotfixCell] = useState('Line Cell 04 · BMW Laser Welding Unit');

  // Sync ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setSyncCount(prev => Number((prev === 0.4 ? 0.3 : 0.4).toFixed(1)));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Subtle progress ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setFlashProgress(prev => {
        if (prev >= 99) return 74;
        return prev + 1;
      });
      setCurrentBlock(prev => {
        if (prev >= totalBlocks) return 4112;
        return prev + 15;
      });
      setEta(prev => {
        if (prev <= 1) return 42;
        return prev - 1;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const openConfirmation = (actionTitle: string) => {
    setModalTitle('Administrative Confirmation');
    setModalDesc(`Are you sure you want to execute '${actionTitle}'? This operation will propagate immediately to Munich VPC-9104.`);
    setModalType('action');
  };

  const triggerLockdownModal = () => {
    setModalTitle('Emergency Lockdown Protocol');
    setModalDesc('CRITICAL: You are about to engage the Emergency Build Lockout Protocol. All active pipeline runners for Plants 01 to 08 will be frozen immediately.');
    setModalType('lockdown');
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSuccessToast(true);
    setTimeout(() => {
      setAuthSuccessToast(false);
      setViewMode('dash');
    }, 1200);
  };

  const handleAddHotfix = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHotfixTitle.trim()) return;

    const newItem: TaskQueueItem = {
      id: 'task-' + Date.now(),
      title: newHotfixTitle,
      status: 'QUEUED',
      lineCell: newHotfixCell,
      countdown: 'T-00:01:30',
      engineer: 'Dr. F. Weber',
      roleTag: 'DEVOPS-HOTFIX',
      jobCode: `#JOB-HOT-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setQueueItems(prev => [newItem, ...prev]);
    setNewHotfixTitle('');
    setModalType(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans antialiased selection:bg-[#dce9ff] selection:text-[#004e89]">
      {/* GLOBAL FIXED HEADER */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#c1c7d3]/50 z-50 flex items-center justify-between px-4 sm:px-6 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        {/* BRAND & REGION IDENTIFIER */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#004e89] flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-[20px]">token</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold text-[#004e89] tracking-tight leading-none">BMW Group</span>
              <span className="text-[10px] font-semibold text-[#5b637a] tracking-wider uppercase font-mono mt-0.5">IT HUB DEVOPS</span>
            </div>
          </div>

          <div className="h-6 w-px bg-[#c1c7d3]/60 hidden sm:block"></div>

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#eff4ff] border border-[#c1c7d3]/60 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-[#5291fe] animate-pulse"></span>
            <span className="font-mono text-[11px] font-semibold text-[#0b1c30]">PROD-DE-MUNICH-HUB</span>
            <span className="font-mono text-[11px] text-slate-400">/</span>
            <span className="font-mono text-[11px] text-[#444b61]">EU-CENTRAL</span>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="flex-1 max-w-md mx-4 lg:mx-6 hidden lg:block">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-[#717782] text-[18px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cluster pods, pipelines, telemetry (Press /)..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#eff4ff] border border-[#c1c7d3]/80 rounded-lg text-xs text-[#0b1c30] placeholder:text-[#717782] focus:outline-none focus:border-[#004e89] focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* UTILITY ICONS & USER & ANGULAR CODE BUTTON */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* VIEW ANGULAR CODE BUTTON */}
          <button
            type="button"
            onClick={() => setModalType('angular')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#dce9ff] hover:bg-[#d0e3ff] text-[#004e89] border border-[#a1c9ff] rounded-lg text-xs font-mono font-bold transition-all shadow-sm cursor-pointer"
            title="View & export complete Angular component code"
          >
            <span className="material-symbols-outlined text-[16px]">code</span>
            <span className="hidden md:inline">Angular Code</span>
            <span className="text-[10px] bg-white px-1.5 py-0.2 rounded text-[#004e89] border border-[#a1c9ff]">v18+</span>
          </button>

          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-[#eff4ff] border border-[#c1c7d3]/60 rounded-lg">
            <span className="material-symbols-outlined text-[#004e89] text-[16px]">sync</span>
            <span className="font-mono text-[11px] font-semibold text-[#0b1c30]">SYNC {syncCount}s</span>
          </div>

          <button
            type="button"
            aria-label="Notifications"
            onClick={() => openConfirmation('View System Telemetry Alerts')}
            className="relative p-2 rounded-lg text-[#414751] hover:text-[#0b1c30] hover:bg-[#e5eeff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#004e89]"></span>
          </button>

          <div className="h-6 w-px bg-[#c1c7d3]/60 hidden sm:block"></div>

          {/* USER PROFILE */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#004e89] flex items-center justify-center text-white font-bold text-xs shadow-sm">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <div className="hidden 2xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#0b1c30] leading-tight">Dr. Florian Weber</span>
              <span className="text-[10px] font-mono text-[#5b637a]">Lead DevOps Architect / FG-9-ZA-72</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setViewMode('auth');
              openConfirmation('Terminate Session & Invalidate Tokens');
            }}
            className="flex items-center gap-1 font-mono text-xs font-semibold text-[#ba1a1a] hover:bg-red-50 hover:text-red-700 px-2 sm:px-2.5 py-1.5 rounded-lg border border-[#c1c7d3]/60 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </header>

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-[#c1c7d3]/50 z-40 hidden md:flex flex-col justify-between p-4">
        <div className="space-y-4">
          <div className="px-2">
            <span className="text-[10px] font-mono font-bold text-[#717782] uppercase tracking-wider">Mission Control</span>
          </div>

          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => setActiveNav('cluster')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left font-semibold ${
                activeNav === 'cluster'
                  ? 'bg-[#004e89] text-white shadow-sm'
                  : 'text-[#414751] hover:bg-[#e5eeff] hover:text-[#0b1c30]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">hub</span>
              <span>Cluster Topology</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNav('pipelines')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                activeNav === 'pipelines'
                  ? 'bg-[#004e89] text-white font-semibold shadow-sm'
                  : 'text-[#414751] hover:bg-[#e5eeff] hover:text-[#0b1c30]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">conversion_path</span>
              <span>Pipelines &amp; CI/CD</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNav('telemetry')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                activeNav === 'telemetry'
                  ? 'bg-[#004e89] text-white font-semibold shadow-sm'
                  : 'text-[#414751] hover:bg-[#e5eeff] hover:text-[#0b1c30]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">monitoring</span>
              <span>Live Telemetry</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNav('security')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                activeNav === 'security'
                  ? 'bg-[#004e89] text-white font-semibold shadow-sm'
                  : 'text-[#414751] hover:bg-[#e5eeff] hover:text-[#0b1c30]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Security &amp; IAM</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNav('nodes')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                activeNav === 'nodes'
                  ? 'bg-[#004e89] text-white font-semibold shadow-sm'
                  : 'text-[#414751] hover:bg-[#e5eeff] hover:text-[#0b1c30]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">dns</span>
              <span>Node Registry</span>
            </button>
          </nav>
        </div>

        {/* SIDEBAR FOOTER HARDWARE BADGE */}
        <div className="pt-3 border-t border-[#c1c7d3]/50">
          <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#c1c7d3]/60">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-semibold text-[#717782]">SECURITY LEVEL</span>
              <span className="text-[10px] font-mono text-[#004e89] font-bold">STAGE-IV</span>
            </div>
            <div className="text-xs font-mono font-semibold text-[#0b1c30]">Munich VPC-9104</div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="md:pl-64">
        <main className="w-full pt-16 min-h-screen bg-[#f8f9ff]">
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">

            {/* TOP OPERATIONAL ENVIRONMENT / VIEW SWITCHER CARD */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-[#c1c7d3]/50 shadow-sm">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#0066b1] flex items-center justify-center text-white shadow-sm flex-shrink-0">
                  <span className="material-symbols-outlined text-[24px]">shield_person</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-semibold text-[#0b1c30]">IT Hub Gateway Environment</span>
                    <span className="px-2 py-0.5 rounded bg-[#dce9ff] text-[#004e89] font-mono text-[11px] font-bold">v4.8.2-PROD</span>
                  </div>
                  <p className="text-xs text-[#5b637a] mt-0.5">Select operational context: Multi-Factor Authentication Entry or Live Connected Operations Suite.</p>
                </div>
              </div>

              {/* VIEW SWITCHER SEGMENTED TABS */}
              <div className="flex items-center bg-[#eff4ff] p-1 rounded-lg border border-[#c1c7d3]/40 self-start md:self-auto overflow-x-auto max-w-full">
                <button
                  type="button"
                  onClick={() => setViewMode('auth')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                    viewMode === 'auth'
                      ? 'bg-white text-[#004e89] shadow-sm font-semibold'
                      : 'text-[#5b637a] hover:text-[#0b1c30]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  <span>Gateway Login</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('dash')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                    viewMode === 'dash'
                      ? 'bg-white text-[#004e89] shadow-sm font-semibold'
                      : 'text-[#5b637a] hover:text-[#0b1c30]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">grid_view</span>
                  <span>Intranet Dashboard</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5291fe]"></span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('both')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                    viewMode === 'both'
                      ? 'bg-white text-[#004e89] shadow-sm font-semibold'
                      : 'text-[#5b637a] hover:text-[#0b1c30]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">splitscreen</span>
                  <span>Dual Architecture</span>
                </button>
              </div>
            </div>

            {/* VIEW CONTAINER 1: AUTHENTICATION GATEWAY ACCESS */}
            {(viewMode === 'auth' || viewMode === 'both') && (
              <section className="w-full flex justify-center py-2 transition-all duration-300">
                <div className="w-full max-w-xl bg-white rounded-xl border border-[#c1c7d3]/60 shadow-md overflow-hidden relative">
                  {/* Top accent gradient bar */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-[#004e89] via-[#0066b1] to-[#5291fe]"></div>

                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] text-[#004e89] font-bold tracking-wider uppercase">BMW GROUP IT HUB</span>
                          <span className="text-slate-300 font-mono text-[10px]">•</span>
                          <span className="font-mono text-[10px] text-[#5b637a] font-medium">Identity Gateway</span>
                        </div>
                        <h1 className="text-2xl font-bold text-[#0b1c30] tracking-tight">DevOps Group Gateway Access</h1>
                        <p className="text-xs text-[#5b637a]">Cryptographic mutual authentication for Munich Plant 01 cluster environments.</p>
                      </div>

                      <div className="hidden sm:flex flex-col items-end">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#eff4ff] text-[#004e89] font-mono text-[10px] font-semibold border border-[#c1c7d3]/40">
                          <span className="material-symbols-outlined text-[13px]">verified</span>
                          TIER-3 RESTRICTED
                        </span>
                        <span className="font-mono text-[9px] text-[#717782] mt-1 font-semibold">ISO-27001 HARDENED</span>
                      </div>
                    </div>

                    {/* Hardware Enclave Banner */}
                    <div className="p-3.5 rounded-lg bg-[#eff4ff] border border-[#c1c7d3]/40 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[#004e89] text-[20px]">vpn_lock</span>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-[#0b1c30]">Hardware Enclave HSM</span>
                          <span className="font-mono text-[10px] text-[#5b637a]">Munich VPC Root CA #9914</span>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#dce9ff] text-[#004e89] font-bold">ONLINE</span>
                    </div>

                    {/* Form fields */}
                    <form onSubmit={handleAuthSubmit} className="space-y-4">
                      {/* Username */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-[#0b1c30]" htmlFor="username">
                            Username / Corporate ID
                          </label>
                          <span className="font-mono text-[10px] text-[#004e89] font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">check_circle</span> Active Directory Sync
                          </span>
                        </div>
                        <div className="relative flex items-center">
                          <span className="material-symbols-outlined absolute left-3 text-[#717782] text-[18px]">account_circle</span>
                          <input
                            id="username"
                            type="email"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 bg-white border border-[#c1c7d3] rounded-lg text-xs text-[#0b1c30] shadow-sm focus:outline-none focus:border-[#004e89]"
                          />
                        </div>
                      </div>

                      {/* Department Code */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-[#0b1c30]" htmlFor="dept-code">
                            Department Code (FG Matrix)
                          </label>
                          <span className="font-mono text-[10px] text-[#717782]">Format: FG-X-XX-XX</span>
                        </div>
                        <div className="relative flex items-center">
                          <span className="material-symbols-outlined absolute left-3 text-[#717782] text-[18px]">domain</span>
                          <input
                            id="dept-code"
                            type="text"
                            required
                            value={departmentCode}
                            onChange={(e) => setDepartmentCode(e.target.value.toUpperCase())}
                            className="w-full pl-10 pr-3 py-2 bg-white border border-[#c1c7d3] rounded-lg font-mono text-xs tracking-wider uppercase text-[#0b1c30] shadow-sm focus:outline-none focus:border-[#004e89]"
                          />
                        </div>
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className="material-symbols-outlined text-[#5291fe] text-[14px]">info</span>
                          <span className="text-[11px] text-[#5b637a]">Munich Plant 01.10 - Vehicle Architecture Platform Group</span>
                        </div>
                      </div>

                      {/* Operational Role */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#0b1c30]" htmlFor="operational-role">
                          Assigned Operational Role
                        </label>
                        <div className="relative flex items-center">
                          <span className="material-symbols-outlined absolute left-3 text-[#717782] text-[18px]">badge</span>
                          <select
                            id="operational-role"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full pl-10 pr-8 py-2 bg-white border border-[#c1c7d3] rounded-lg text-xs text-[#0b1c30] shadow-sm focus:outline-none focus:border-[#004e89] appearance-none cursor-pointer"
                          >
                            <option>DevOps Cluster Administrator (Full Access)</option>
                            <option>Technical Lead &amp; Release Auditor</option>
                            <option>Plant Assembly Robotics Integrator</option>
                            <option>Site Reliability Engineer (On-Call SRE)</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 text-[#717782] text-[18px] pointer-events-none">expand_more</span>
                        </div>
                      </div>

                      {/* Workstation remember & Yubikey */}
                      <div className="pt-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#eff4ff] p-3 rounded-lg border border-[#c1c7d3]/40">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={rememberWorkstation}
                              onChange={(e) => setRememberWorkstation(e.target.checked)}
                              className="w-4 h-4 rounded text-[#004e89] focus:ring-0 cursor-pointer"
                            />
                            <span className="text-xs text-[#0b1c30]">Remember certified terminal workstation</span>
                          </label>
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            <span className="text-[#5b637a]">YubiKey / FIDO2:</span>
                            <span className="text-[#004e89] font-bold">READY</span>
                          </div>
                        </div>
                      </div>

                      {/* Submit button */}
                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 rounded-lg bg-[#0066b1] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm hover:bg-[#004e89] active:scale-[0.99] transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">login</span>
                        <span>Authenticate &amp; Enter Portal</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>

                      {authSuccessToast && (
                        <div className="p-2 bg-emerald-50 text-emerald-800 text-xs font-mono rounded-lg border border-emerald-200 text-center animate-fade-in">
                          Mutual TLS Authentication Verified. Redirecting to Munich Intranet...
                        </div>
                      )}
                    </form>

                    {/* Bottom cryptographic footnote */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 text-center font-mono text-[10px] text-[#5b637a]">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5291fe]"></span>
                        Mutual TLS 1.3 Certified
                      </span>
                      <span className="text-slate-300 hidden sm:inline">·</span>
                      <span>Hardware Enclave HSM Validated</span>
                      <span className="text-slate-300 hidden sm:inline">·</span>
                      <span>Bavaria Root Node #01</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* VIEW CONTAINER 2: INTRANET WORKSPACE - CONNECTED DEVOPS MATRIX */}
            {(viewMode === 'dash' || viewMode === 'both') && (
              <section className="w-full space-y-6">
                {/* CONTEXT BANNER WITH TELEMETRY PILLS */}
                <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#c1c7d3]/50 shadow-sm relative overflow-hidden">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-[#004e89] text-white font-mono text-[10px] font-bold">PLANT MUNICH 01.10</span>
                        <span className="font-mono text-[11px] text-[#5b637a]">FITZGERALD-RING 41</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-mono text-[11px] text-[#004e89] font-semibold">ZONE DE-MUC-AZ-1</span>
                      </div>
                      <h2 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Connected DevOps Matrix</h2>
                      <p className="text-xs text-[#5b637a]">Automated vehicle assembly integration pipelines, Over-The-Air deployment verification, and zero-trust cluster state.</p>
                    </div>

                    {/* 4 TELEMETRY PILLS */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#c1c7d3]/40 flex flex-col">
                        <span className="font-mono text-[10px] text-[#5b637a] uppercase font-semibold">Build Pipelines</span>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="font-mono text-base font-bold text-[#0b1c30]">99.94%</span>
                          <span className="material-symbols-outlined text-[#004e89] text-[16px]">trending_up</span>
                        </div>
                        <span className="text-[11px] text-[#004e89] font-semibold">Healthy Status</span>
                      </div>

                      <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#c1c7d3]/40 flex flex-col">
                        <span className="font-mono text-[10px] text-[#5b637a] uppercase font-semibold">Cluster Nodes</span>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="font-mono text-base font-bold text-[#0b1c30]">128</span>
                          <span className="font-mono text-xs text-[#717782]">/ 128</span>
                        </div>
                        <span className="text-[11px] text-[#5b637a]">0 Standby Drain</span>
                      </div>

                      <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#c1c7d3]/40 flex flex-col">
                        <span className="font-mono text-[10px] text-[#5b637a] uppercase font-semibold">Security State</span>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="font-mono text-base font-bold text-[#0b1c30]">100%</span>
                          <span className="material-symbols-outlined text-[#004e89] text-[15px]">lock</span>
                        </div>
                        <span className="text-[11px] text-[#004e89] font-semibold">mTLS Enforced</span>
                      </div>

                      <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#c1c7d3]/40 flex flex-col">
                        <span className="font-mono text-[10px] text-[#5b637a] uppercase font-semibold">OTA Queue</span>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="font-mono text-base font-bold text-[#0b1c30]">14</span>
                          <span className="text-xs text-[#5b637a]">Vehicles</span>
                        </div>
                        <span className="text-[11px] text-[#0066b1] font-semibold">Active Sync</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3-CARD STRUCTURAL MODULE GRID */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

                  {/* CARD 1: ASSEMBLY TASK SHEET (5 cols on XL) */}
                  <div className="xl:col-span-5 bg-white rounded-xl border border-[#c1c7d3]/50 shadow-sm overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="p-4 bg-[#eff4ff] border-b border-[#c1c7d3]/40 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#0066b1] text-white flex items-center justify-center shadow-sm">
                          <span className="material-symbols-outlined text-[18px]">precision_manufacturing</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-[#0b1c30]">Assembly Task Sheet</h3>
                          <span className="font-mono text-[10px] text-[#5b637a]">PLANT-LINE-MUC-04 // ROBOTICS CI/CD</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-md bg-white border border-[#c1c7d3]/50 text-[#004e89] font-mono text-[10px] font-bold flex items-center gap-1.5 shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-[#0066b1] animate-ping"></span> LIVE
                      </span>
                    </div>

                    {/* Active primary deployment highlight */}
                    <div className="p-4 bg-[#eff4ff]/40 border-b border-[#c1c7d3]/30">
                      <div className="p-4 bg-white rounded-lg border border-[#c1c7d3]/50 shadow-sm space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#004e89] font-mono text-[10px] font-bold">ACTIVE FLASH</span>
                              <span className="font-mono text-[10px] text-[#5b637a]">Target: Munich Line 04</span>
                            </div>
                            <h4 className="text-sm font-semibold text-[#0b1c30] mt-1">ECU Firmware Flash v4.18.2</h4>
                            <p className="text-xs text-[#5b637a]">Vehicle Program: BMW i4 M50 (Chassis #WBA0039420)</p>
                          </div>
                          <span className="px-2.5 py-1 rounded-md bg-[#dce9ff] text-[#004e89] font-mono text-[10px] font-semibold">
                            IN PROGRESS ({flashProgress}%)
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="w-full bg-[#e5eeff] rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-[#004e89] h-full rounded-full transition-all duration-500"
                              style={{ width: `${flashProgress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between font-mono text-[11px] text-[#5b637a]">
                            <span>CAN-Bus Ingestion: Block {currentBlock.toLocaleString()} of {totalBlocks.toLocaleString()}</span>
                            <span className="text-[#004e89] font-semibold">ETA: {eta}s</span>
                          </div>
                        </div>

                        {/* Verification Badges */}
                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                          <div className="flex items-center gap-1 text-[#004e89] font-mono text-[10px] font-medium">
                            <span className="material-symbols-outlined text-[15px]">verified</span>
                            Automated Tests Verified
                          </div>
                          <div className="flex items-center gap-1 text-[#004e89] font-mono text-[10px] font-medium justify-end">
                            <span className="material-symbols-outlined text-[15px]">security</span>
                            Rollback Safety Armed
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Task Queue List */}
                    <div className="p-4 space-y-3">
                      <span className="font-mono text-[10px] text-[#5b637a] uppercase font-bold tracking-wider">Immediate Execution Queue</span>

                      <div className="space-y-2">
                        {queueItems.map(item => (
                          <div
                            key={item.id}
                            className="p-3 rounded-lg bg-[#eff4ff]/60 border border-[#c1c7d3]/40 hover:bg-[#eff4ff] transition-all flex flex-col gap-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-[#0b1c30]">{item.title}</span>
                              <span
                                className={`px-2 py-0.5 rounded font-mono text-[9px] font-semibold ${
                                  item.status === 'COMPLETED'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-[#dce9ff] text-[#004e89]'
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[#5b637a] text-xs">
                              <span>{item.lineCell}</span>
                              <span
                                className={`font-mono text-[10px] font-medium ${
                                  item.status === 'COMPLETED' ? 'text-[#004e89] font-semibold' : ''
                                }`}
                              >
                                {item.countdown}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-[#c1c7d3]/20 font-mono text-[10px]">
                              <span className="text-[#5b637a]">Eng: <strong className="text-[#0b1c30]">{item.engineer}</strong> ({item.roleTag})</span>
                              <span className="text-[#717782]">{item.jobCode}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex justify-between items-center border-t border-[#c1c7d3]/30">
                        <button
                          type="button"
                          onClick={() => setModalType('hotfix')}
                          className="font-mono text-xs text-[#004e89] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">add_circle</span> Inject Hotfix Task
                        </button>
                        <span className="font-mono text-[10px] text-[#5b637a]">Worker Nodes: 16 Healthy</span>
                      </div>
                    </div>
                  </div>

                  {/* CARD 2: #REPORTS / AUDITS & SYSTEM CONTROLS (7 cols on XL) */}
                  <div className="xl:col-span-7 space-y-6">

                    {/* CARD: TECHNICAL CAMPAIGN AUDITS */}
                    <div className="bg-white rounded-xl border border-[#c1c7d3]/50 shadow-sm overflow-hidden">
                      <div className="p-4 bg-[#eff4ff] border-b border-[#c1c7d3]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#0066b1] text-white flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-[18px]">verified_user</span>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-[#0b1c30]">#reports · Technical Campaign Audits</h3>
                            <span className="font-mono text-[10px] text-[#5b637a]">COMPLIANCE &amp; CRYPTOGRAPHIC LEDGER</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => openConfirmation('Export Cryptographic Ledger (PDF/A)')}
                          className="px-3 py-1.5 rounded-lg bg-white border border-[#c1c7d3] text-[#0b1c30] font-mono text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[16px]">file_download</span>
                          Export Ledger (PDF/A)
                        </button>
                      </div>

                      {/* Filter tabs */}
                      <div className="px-4 py-2 border-b border-[#c1c7d3]/30 flex items-center gap-1 overflow-x-auto bg-[#eff4ff]/30">
                        <button
                          type="button"
                          onClick={() => setSelectedAuditTab('all')}
                          className={`px-3 py-1 rounded-md text-xs font-mono font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                            selectedAuditTab === 'all'
                              ? 'bg-[#004e89] text-white'
                              : 'text-[#5b637a] hover:bg-[#eff4ff]'
                          }`}
                        >
                          All Audits (1,492)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedAuditTab('ota')}
                          className={`px-3 py-1 rounded-md text-xs font-mono font-medium whitespace-nowrap transition-colors cursor-pointer ${
                            selectedAuditTab === 'ota'
                              ? 'bg-[#004e89] text-white'
                              : 'text-[#5b637a] hover:bg-[#eff4ff]'
                          }`}
                        >
                          OTA Flash Campaigns
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedAuditTab('safety')}
                          className={`px-3 py-1 rounded-md text-xs font-mono font-medium whitespace-nowrap transition-colors cursor-pointer ${
                            selectedAuditTab === 'safety'
                              ? 'bg-[#004e89] text-white'
                              : 'text-[#5b637a] hover:bg-[#eff4ff]'
                          }`}
                        >
                          Safety Telemetry
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedAuditTab('ecu')}
                          className={`px-3 py-1 rounded-md text-xs font-mono font-medium whitespace-nowrap transition-colors cursor-pointer ${
                            selectedAuditTab === 'ecu'
                              ? 'bg-[#004e89] text-white'
                              : 'text-[#5b637a] hover:bg-[#eff4ff]'
                          }`}
                        >
                          ECU Conformance
                        </button>
                      </div>

                      {/* Highlighted primary record */}
                      <div className="p-4 space-y-4">
                        <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#c1c7d3]/50 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#004e89]">#AUD-BMW-9842</span>
                              <span className="px-2 py-0.5 rounded bg-[#dce9ff] text-[#004e89] font-mono text-[10px] font-bold">CERTIFIED</span>
                              <span className="font-mono text-xs text-[#5b637a]">Series G26 / i4 Gran Coupe</span>
                            </div>
                            <span className="font-mono text-[10px] text-[#717782]">2025-05-18 09:14:22 UTC</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="space-y-0.5">
                              <span className="font-mono text-[10px] text-[#5b637a] uppercase">Cryptographic Signature</span>
                              <p className="font-mono text-xs text-[#0b1c30] break-all">ECDSA P-384 / SHA3-512 [OK]</p>
                            </div>
                            <div className="space-y-0.5">
                              <span className="font-mono text-[10px] text-[#5b637a] uppercase">Compliance Score</span>
                              <p className="text-base font-bold text-[#004e89]">99.8% <span className="text-xs font-normal text-[#5b637a]">Pass</span></p>
                            </div>
                            <div className="space-y-0.5">
                              <span className="font-mono text-[10px] text-[#5b637a] uppercase">Auditor / Enclave</span>
                              <p className="font-mono text-xs text-[#0b1c30]">Dr. F. Weber (FG-9-ZA-72)</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#c1c7d3]/30">
                            <span className="text-xs text-[#5b637a]">Target ECUs: <strong className="text-[#0b1c30]">ADAS-Domain, Brake-By-Wire, In-Vehicle Gateway</strong></span>
                            <button
                              type="button"
                              onClick={() => openConfirmation('Download Audit Sign-Off Report (#AUD-BMW-9842)')}
                              className="px-3 py-1.5 rounded-lg bg-[#0066b1] text-white font-mono text-xs font-semibold hover:bg-[#004e89] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[15px]">description</span>
                              Download Audit Sign-Off Report
                            </button>
                          </div>
                        </div>

                        {/* Recent Audits Table */}
                        <div className="overflow-x-auto border border-[#c1c7d3]/40 rounded-lg">
                          <table className="w-full text-left font-sans text-xs">
                            <thead className="bg-[#eff4ff] font-mono text-[10px] text-[#5b637a] uppercase tracking-wider">
                              <tr>
                                <th className="py-2.5 px-3">Audit ID</th>
                                <th className="py-2.5 px-3">Vehicle Series</th>
                                <th className="py-2.5 px-3">Signing Alg</th>
                                <th className="py-2.5 px-3">Score</th>
                                <th className="py-2.5 px-3 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#c1c7d3]/30 font-mono text-xs">
                              {audits.map(audit => (
                                <tr key={audit.id} className="hover:bg-[#eff4ff]/40 transition-colors">
                                  <td className="py-2.5 px-3 font-bold text-[#0b1c30]">{audit.id}</td>
                                  <td className="py-2.5 px-3 text-[#0b1c30] font-sans">{audit.series}</td>
                                  <td className="py-2.5 px-3 text-[#5b637a]">{audit.algorithm}</td>
                                  <td className="py-2.5 px-3 text-[#004e89] font-bold">{audit.score}</td>
                                  <td className="py-2.5 px-3 text-right font-sans">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedAudit(audit);
                                        setModalType('inspect');
                                      }}
                                      className="text-[#004e89] hover:underline font-semibold cursor-pointer"
                                    >
                                      Inspect
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* CARD 3: SYSTEM ADMINISTRATION CONTROLS (RESTRICTED) */}
                    <div className="bg-white rounded-xl border border-[#c1c7d3]/50 shadow-sm overflow-hidden">
                      <div className="p-4 bg-[#eff4ff] border-b border-[#c1c7d3]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shadow-xs">
                            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-semibold text-[#0b1c30]">System Administration Controls</h3>
                              <span className="px-2 py-0.5 rounded bg-[#ba1a1a] text-white font-mono text-[9px] font-bold">RESTRICTED</span>
                            </div>
                            <span className="font-mono text-[10px] text-[#5b637a]">PRIVILEGED ACCESS LEVEL: ROOT DEVOPS OPERATOR</span>
                          </div>
                        </div>
                        <span className="font-mono text-[10px] px-2.5 py-1 rounded bg-[#dce9ff] text-[#004e89] font-bold self-start sm:self-auto">
                          HSM SESSION ACTIVE
                        </span>
                      </div>

                      <div className="p-4 space-y-4">
                        {/* 2x2 Toggles Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* TOGGLE 1 */}
                          <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#c1c7d3]/40 flex items-center justify-between">
                            <div className="space-y-0.5">
                              <span className="text-xs font-semibold text-[#0b1c30]">Cluster Failover Switch</span>
                              <p className="font-mono text-[10px] text-[#5b637a]">Route traffic to Standby Munich-East</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={clusterFailover}
                                onChange={(e) => setClusterFailover(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-10 h-5 bg-[#c1c7d3] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#004e89]"></div>
                            </label>
                          </div>

                          {/* TOGGLE 2 */}
                          <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#c1c7d3]/40 flex items-center justify-between">
                            <div className="space-y-0.5">
                              <span className="text-xs font-semibold text-[#0b1c30]">Ingress Rate Throttling</span>
                              <p className="font-mono text-[10px] text-[#5b637a]">Clamp production API limit (50k req/s)</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={ingressThrottling}
                                onChange={(e) => setIngressThrottling(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-10 h-5 bg-[#c1c7d3] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#004e89]"></div>
                            </label>
                          </div>

                          {/* ACTION 3 */}
                          <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#c1c7d3]/40 flex items-center justify-between">
                            <div className="space-y-0.5">
                              <span className="text-xs font-semibold text-[#0b1c30]">Zero-Trust Token Revocation</span>
                              <p className="font-mono text-[10px] text-[#5b637a]">Flush non-hardware OAuth sessions</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => openConfirmation('Flush Zero-Trust OAuth Tokens')}
                              className="px-2.5 py-1 rounded-md bg-white border border-[#c1c7d3] text-[#0b1c30] font-mono text-[11px] font-semibold hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
                            >
                              Flush Now
                            </button>
                          </div>

                          {/* ACTION 4 */}
                          <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#c1c7d3]/40 flex items-center justify-between">
                            <div className="space-y-0.5">
                              <span className="text-xs font-semibold text-[#0b1c30]">Emergency Lockout Protocol</span>
                              <p className="font-mono text-[10px] text-[#5b637a]">Halt all Line 01-08 pipeline runners</p>
                            </div>
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#e5eeff] text-[#5b637a] font-bold">
                              {emergencyLockdownArmed ? 'ENGAGED' : 'STANDBY'}
                            </span>
                          </div>
                        </div>

                        {/* Bottom Actions Cluster */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#c1c7d3]/30">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openConfirmation('Purge Stale Artifacts')}
                              className="px-3 py-2 rounded-lg bg-[#eff4ff] border border-[#c1c7d3]/60 text-[#0b1c30] text-xs font-semibold hover:bg-[#e5eeff] transition-colors cursor-pointer shadow-xs"
                            >
                              Purge Stale Artifacts
                            </button>
                            <button
                              type="button"
                              onClick={() => openConfirmation('Rotate Signing Keys')}
                              className="px-3 py-2 rounded-lg bg-[#eff4ff] border border-[#c1c7d3]/60 text-[#0b1c30] text-xs font-semibold hover:bg-[#e5eeff] transition-colors cursor-pointer shadow-xs"
                            >
                              Rotate Signing Keys
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={triggerLockdownModal}
                            className="px-4 py-2 rounded-lg bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold hover:bg-[#ba1a1a] hover:text-white transition-all flex items-center gap-1.5 border border-red-200 cursor-pointer shadow-xs"
                          >
                            <span className="material-symbols-outlined text-[18px]">gavel</span>
                            Execute Emergency Lockdown
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </section>
            )}

          </div>
        </main>
      </div>

      {/* CONFIRMATION / ACTION MODAL */}
      {modalType && modalType !== 'angular' && modalType !== 'hotfix' && modalType !== 'inspect' && (
        <div className="fixed inset-0 z-50 bg-[#0b1c30]/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all animate-fade-in">
          <div className="bg-white max-w-md w-full rounded-xl shadow-2xl border border-[#c1c7d3] overflow-hidden">
            <div className="p-4 bg-[#eff4ff] border-b border-[#c1c7d3]/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`material-symbols-outlined text-[22px] ${
                    modalType === 'lockdown' ? 'text-[#ba1a1a]' : 'text-[#004e89]'
                  }`}
                >
                  {modalType === 'lockdown' ? 'warning' : 'admin_panel_settings'}
                </span>
                <span className="text-sm font-semibold text-[#0b1c30]">{modalTitle}</span>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="text-[#717782] hover:text-[#0b1c30] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-[#0b1c30] leading-relaxed">{modalDesc}</p>
              <div className="p-2.5 rounded-lg bg-[#eff4ff] font-mono text-[10px] text-[#5b637a] border border-[#c1c7d3]/40">
                Security Stamp: FG-9-ZA-72 // HSM-CERT-2025 // MUNICH-AZ-1
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-3 py-1.5 rounded-lg border border-[#c1c7d3] text-xs font-semibold text-[#0b1c30] hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (modalType === 'lockdown') {
                      setEmergencyLockdownArmed(true);
                    }
                    setModalType(null);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-white text-xs font-semibold shadow-sm hover:opacity-90 cursor-pointer ${
                    modalType === 'lockdown' ? 'bg-[#ba1a1a]' : 'bg-[#004e89]'
                  }`}
                >
                  Confirm &amp; Execute
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HOTFIX INJECTION MODAL */}
      {modalType === 'hotfix' && (
        <div className="fixed inset-0 z-50 bg-[#0b1c30]/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
          <div className="bg-white max-w-lg w-full rounded-xl shadow-2xl border border-[#c1c7d3] overflow-hidden">
            <div className="p-4 bg-[#eff4ff] border-b border-[#c1c7d3]/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#004e89] text-[20px]">add_circle</span>
                <span className="text-sm font-semibold text-[#0b1c30]">Inject Hotfix Task into Assembly Queue</span>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="text-[#717782] hover:text-[#0b1c30] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddHotfix} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#0b1c30]">Task Title / Operation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Laser Weld Seam Calibration v3.0"
                  value={newHotfixTitle}
                  onChange={(e) => setNewHotfixTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#c1c7d3] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#004e89]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#0b1c30]">Production Target Cell</label>
                <input
                  type="text"
                  required
                  value={newHotfixCell}
                  onChange={(e) => setNewHotfixCell(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#c1c7d3] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#004e89]"
                />
              </div>

              <div className="p-3 bg-[#eff4ff] rounded-lg font-mono text-[10px] text-[#5b637a] space-y-1">
                <div>Engineer: <strong>Dr. F. Weber</strong> (DEVOPS-HOTFIX)</div>
                <div>Target Line: <strong>Plant Munich 01.10 - Line Cell 04</strong></div>
                <div>HSM Signing: <strong>Automatic Ed25519 Token Applied</strong></div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-3 py-1.5 rounded-lg border border-[#c1c7d3] text-xs font-semibold text-[#0b1c30] hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#004e89] text-white text-xs font-semibold shadow-sm hover:bg-[#0066b1] cursor-pointer"
                >
                  Inject &amp; Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AUDIT INSPECTOR MODAL */}
      {modalType === 'inspect' && selectedAudit && (
        <div className="fixed inset-0 z-50 bg-[#0b1c30]/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
          <div className="bg-white max-w-lg w-full rounded-xl shadow-2xl border border-[#c1c7d3] overflow-hidden">
            <div className="p-4 bg-[#eff4ff] border-b border-[#c1c7d3]/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#004e89] text-[20px]">verified_user</span>
                <span className="text-sm font-semibold text-[#0b1c30]">Cryptographic Audit Inspection: {selectedAudit.id}</span>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="text-[#717782] hover:text-[#0b1c30] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-[#5b637a] uppercase">Vehicle Series</span>
                  <div className="font-semibold text-[#0b1c30]">{selectedAudit.series}</div>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#5b637a] uppercase">Compliance Score</span>
                  <div className="font-mono text-emerald-700 font-bold">{selectedAudit.score} Pass</div>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#5b637a] uppercase">Signing Algorithm</span>
                  <div className="font-mono text-[#004e89]">{selectedAudit.algorithm}</div>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#5b637a] uppercase">Timestamp</span>
                  <div className="font-mono text-[#5b637a]">{selectedAudit.date}</div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#5b637a] uppercase">Target ECUs Verified</span>
                <div className="p-2.5 rounded-lg bg-[#eff4ff] font-mono text-xs text-[#0b1c30] border border-[#c1c7d3]/40">
                  {selectedAudit.ecus}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#eff4ff] font-mono text-[10px] text-[#5b637a]">
                Root Chain: Bavaria Root Node #01 -&gt; Munich VPC CA #9914 -&gt; Enclave HSM FG-9-ZA-72
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-1.5 rounded-lg bg-[#004e89] text-white text-xs font-semibold cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPLETE ANGULAR CODE EXPORTER MODAL */}
      {modalType === 'angular' && (
        <div className="fixed inset-0 z-50 bg-[#0b1c30]/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 transition-all">
          <div className="bg-white max-w-4xl w-full h-[90vh] rounded-xl shadow-2xl border border-[#c1c7d3] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 bg-[#eff4ff] border-b border-[#c1c7d3]/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#dd0031] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  NG
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[#0b1c30]">Generated Angular 18/19 Standalone Code</h3>
                    <span className="px-2 py-0.5 rounded bg-[#dce9ff] text-[#004e89] font-mono text-[10px] font-bold">BMW Design System</span>
                  </div>
                  <p className="text-[11px] text-[#5b637a]">Production-ready component matching the exact visual layout and components</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const code =
                      angularTab === 'ts'
                        ? ANGULAR_COMPONENT_TS
                        : angularTab === 'html'
                        ? ANGULAR_COMPONENT_HTML
                        : angularTab === 'css'
                        ? ANGULAR_COMPONENT_CSS
                        : 'See guide';
                    copyToClipboard(code);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#004e89] text-white font-mono text-xs font-semibold hover:bg-[#0066b1] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  <span>{copySuccess ? 'Copied to Clipboard!' : 'Copy Current File'}</span>
                </button>

                <button
                  onClick={() => setModalType(null)}
                  className="text-[#717782] hover:text-[#0b1c30] p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Code Tabs */}
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setAngularTab('ts')}
                className={`px-3 py-1.5 rounded-md font-mono text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                  angularTab === 'ts'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>bmw-devops-dashboard.component.ts</span>
              </button>

              <button
                type="button"
                onClick={() => setAngularTab('html')}
                className={`px-3 py-1.5 rounded-md font-mono text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                  angularTab === 'html'
                    ? 'bg-orange-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>bmw-devops-dashboard.component.html</span>
              </button>

              <button
                type="button"
                onClick={() => setAngularTab('css')}
                className={`px-3 py-1.5 rounded-md font-mono text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                  angularTab === 'css'
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>bmw-devops-dashboard.component.css</span>
              </button>

              <button
                type="button"
                onClick={() => setAngularTab('guide')}
                className={`px-3 py-1.5 rounded-md font-mono text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                  angularTab === 'guide'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>Integration &amp; Setup Guide</span>
              </button>
            </div>

            {/* Code Content Container */}
            <div className="flex-1 overflow-auto bg-[#0b101b] p-4 text-slate-100 font-mono text-xs leading-relaxed selection:bg-blue-700 selection:text-white">
              {angularTab === 'ts' && (
                <pre className="whitespace-pre">{ANGULAR_COMPONENT_TS}</pre>
              )}

              {angularTab === 'html' && (
                <pre className="whitespace-pre">{ANGULAR_COMPONENT_HTML}</pre>
              )}

              {angularTab === 'css' && (
                <pre className="whitespace-pre">{ANGULAR_COMPONENT_CSS}</pre>
              )}

              {angularTab === 'guide' && (
                <div className="p-2 space-y-4 font-sans text-slate-200">
                  <h4 className="font-mono text-sm font-bold text-white">How to use this component in your Angular application:</h4>
                  
                  <div className="space-y-2">
                    <p className="text-xs text-slate-300">1. Create a new standalone component in your Angular project:</p>
                    <div className="bg-slate-900 p-3 rounded font-mono text-xs text-emerald-400 border border-slate-800">
                      ng g c components/bmw-devops-dashboard --standalone
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-slate-300">2. Copy the TypeScript file into <code className="text-cyan-300">bmw-devops-dashboard.component.ts</code></p>
                    <p className="text-xs text-slate-300">3. Copy the HTML template into <code className="text-cyan-300">bmw-devops-dashboard.component.html</code></p>
                    <p className="text-xs text-slate-300">4. Copy the CSS styles into <code className="text-cyan-300">bmw-devops-dashboard.component.css</code></p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-slate-300">5. Include Material Symbols Outlined &amp; IBM Plex fonts in your <code className="text-cyan-300">index.html</code>:</p>
                    <div className="bg-slate-900 p-3 rounded font-mono text-xs text-amber-300 border border-slate-800 overflow-x-auto">
                      &lt;link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&amp;family=JetBrains+Mono:wght@400;500;600&amp;display=swap" rel="stylesheet" /&gt;<br/>
                      &lt;link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" /&gt;
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-slate-300">6. Ensure Tailwind CSS is configured with your application template paths.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-[#eff4ff] border-t border-[#c1c7d3]/50 flex items-center justify-between font-mono text-[11px] text-[#5b637a]">
              <span>Angular Signals &amp; Modern Standalone Architecture</span>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="px-4 py-1.5 rounded-lg bg-[#004e89] text-white font-semibold hover:bg-[#0066b1] cursor-pointer"
              >
                Close Code Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
