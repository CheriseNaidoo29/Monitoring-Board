/**
 * Complete, production-ready Angular 18+ Standalone Component
 * Matching the BMW Group IT Hub DevOps Matrix UI design
 */

export const ANGULAR_COMPONENT_TS = `import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface AuditRecord {
  id: string;
  series: string;
  algorithm: string;
  score: string;
  isPassing: boolean;
}

export interface TaskQueueItem {
  id: string;
  title: string;
  status: 'QUEUED' | 'VERIFYING' | 'COMPLETED';
  lineCell: string;
  countdown: string;
  engineer: string;
  roleTag: string;
  jobCode: string;
}

@Component({
  selector: 'app-bmw-devops-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bmw-devops-dashboard.component.html',
  styleUrls: ['./bmw-devops-dashboard.component.css']
})
export class BmwDevopsDashboardComponent {
  // Navigation & View State
  activeNav = signal<'cluster' | 'pipelines' | 'telemetry' | 'security' | 'nodes'>('cluster');
  viewMode = signal<'both' | 'auth' | 'dash'>('both');
  searchQuery = signal<string>('');
  syncSeconds = signal<number>(0.4);

  // Authentication State
  username = signal<string>('f.weber@bmwgroup.net');
  departmentCode = signal<string>('FG-9-ZA-72');
  selectedRole = signal<string>('DevOps Cluster Administrator (Full Access)');
  rememberWorkstation = signal<boolean>(true);
  isAuthenticated = signal<boolean>(true);

  // Operational State & Toggles
  clusterFailover = signal<boolean>(false);
  ingressThrottling = signal<boolean>(true);
  emergencyLockdownArmed = signal<boolean>(false);

  // Modals
  activeModal = signal<'lockdown' | 'action' | 'hotfix' | 'inspect' | null>(null);
  modalTitle = signal<string>('');
  modalMessage = signal<string>('');

  // Primary Flash Task State
  flashProgress = signal<number>(74);
  currentBlock = signal<number>(4112);
  totalBlocks = signal<number>(5556);
  etaSeconds = signal<number>(42);

  // Audit Tab Filter
  selectedAuditTab = signal<'all' | 'ota' | 'safety' | 'ecu'>('all');

  // Audit Ledger Data
  audits: AuditRecord[] = [
    { id: '#AUD-BMW-9841', series: 'G70 / i7 xDrive60', algorithm: 'Ed25519-HSM', score: '100.0%', isPassing: true },
    { id: '#AUD-BMW-9840', series: 'G05 / X5 xDrive50e', algorithm: 'ECDSA P-384', score: '99.4%', isPassing: true },
    { id: '#AUD-BMW-9839', series: 'G20 / 330e Hybrid', algorithm: 'RSA-PSS-4096', score: '98.9%', isPassing: true }
  ];

  // Execution Queue Data
  queueItems: TaskQueueItem[] = [
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
  ];

  // Actions
  setViewMode(mode: 'both' | 'auth' | 'dash') {
    this.viewMode.set(mode);
  }

  handleLogin() {
    this.isAuthenticated.set(true);
    this.viewMode.set('dash');
  }

  openConfirmation(actionName: string) {
    this.modalTitle.set('Administrative Confirmation');
    this.modalMessage.set(\`Are you sure you want to execute '\${actionName}'? This operation will propagate immediately to Munich VPC-9104.\`);
    this.activeModal.set('action');
  }

  triggerEmergencyLockdown() {
    this.modalTitle.set('Emergency Lockdown Protocol');
    this.modalMessage.set('CRITICAL: You are about to engage the Emergency Build Lockout Protocol. All active pipeline runners for Plants 01 to 08 will be frozen immediately.');
    this.activeModal.set('lockdown');
  }

  openHotfixModal() {
    this.activeModal.set('hotfix');
  }

  closeModal() {
    this.activeModal.set(null);
  }

  confirmModalAction() {
    if (this.activeModal() === 'lockdown') {
      this.emergencyLockdownArmed.set(true);
    }
    this.closeModal();
  }
}
`;

export const ANGULAR_COMPONENT_HTML = `<div class="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans antialiased">
  <!-- TOP NAVIGATION HEADER -->
  <header class="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#c1c7d3]/50 z-50 flex items-center justify-between px-6 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
    <!-- BRAND / ZONE -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-[#004e89] flex items-center justify-center text-white shadow-sm">
          <span class="material-symbols-outlined text-[20px]">token</span>
        </div>
        <div class="flex flex-col">
          <span class="text-base font-semibold text-[#004e89] tracking-tight leading-none">BMW Group</span>
          <span class="text-[10px] font-semibold text-[#5b637a] tracking-wider uppercase font-mono mt-0.5">IT Hub DevOps</span>
        </div>
      </div>

      <div class="h-6 w-px bg-[#c1c7d3]/60 hidden sm:block"></div>

      <div class="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#eff4ff] border border-[#c1c7d3]/60 rounded-lg">
        <span class="w-2 h-2 rounded-full bg-[#5291fe] animate-pulse"></span>
        <span class="font-mono text-[11px] font-semibold text-[#0b1c30]">PROD-DE-MUNICH-HUB</span>
        <span class="font-mono text-[11px] text-slate-400">/</span>
        <span class="font-mono text-[11px] text-[#444b61]">EU-CENTRAL</span>
      </div>
    </div>

    <!-- CENTER SEARCH -->
    <div class="flex-1 max-w-md mx-6 hidden lg:block">
      <div class="relative flex items-center">
        <span class="material-symbols-outlined absolute left-3 text-[#717782] text-[18px]">search</span>
        <input
          type="text"
          [ngModel]="searchQuery()"
          (ngModelChange)="searchQuery.set($event)"
          placeholder="Search cluster pods, pipelines, telemetry (Press /)..."
          class="w-full pl-9 pr-3 py-1.5 bg-[#eff4ff] border border-[#c1c7d3]/80 rounded-lg text-xs text-[#0b1c30] placeholder:text-[#717782] focus:outline-none focus:border-[#004e89] focus:bg-white transition-colors"
        />
      </div>
    </div>

    <!-- RIGHT UTILITIES -->
    <div class="flex items-center gap-3">
      <div class="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-[#eff4ff] border border-[#c1c7d3]/60 rounded-lg">
        <span class="material-symbols-outlined text-[#004e89] text-[16px] animate-spin-slow">sync</span>
        <span class="font-mono text-[11px] font-semibold text-[#0b1c30]">SYNC {{ syncSeconds() }}s</span>
      </div>

      <button
        type="button"
        aria-label="Notifications"
        class="relative p-2 rounded-lg text-[#414751] hover:text-[#0b1c30] hover:bg-[#e5eeff] transition-colors"
      >
        <span class="material-symbols-outlined text-[20px]">notifications</span>
        <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#004e89]"></span>
      </button>

      <div class="h-6 w-px bg-[#c1c7d3]/60"></div>

      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-full bg-[#004e89] flex items-center justify-center text-white">
          <span class="material-symbols-outlined text-[18px]">person</span>
        </div>
        <div class="hidden 2xl:flex flex-col text-left">
          <span class="text-xs font-semibold text-[#0b1c30] leading-tight">Dr. Florian Weber</span>
          <span class="text-[10px] font-mono text-[#5b637a]">Lead DevOps Architect / FG-9-ZA-72</span>
        </div>
      </div>

      <button
        type="button"
        class="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#ba1a1a] hover:bg-red-50 px-2.5 py-1.5 rounded-lg border border-[#c1c7d3]/60 transition-colors"
      >
        <span class="material-symbols-outlined text-[16px]">logout</span>
        <span class="hidden sm:inline">Log Out</span>
      </button>
    </div>
  </header>

  <!-- LEFT SIDEBAR -->
  <aside class="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-[#c1c7d3]/50 z-40 flex flex-col justify-between p-4">
    <div class="space-y-4">
      <div class="px-2">
        <span class="text-[10px] font-mono font-bold text-[#717782] uppercase tracking-wider">Mission Control</span>
      </div>
      <nav class="space-y-1">
        <button
          type="button"
          (click)="activeNav.set('cluster')"
          [class.bg-[#004e89]]="activeNav() === 'cluster'"
          [class.text-white]="activeNav() === 'cluster'"
          [class.text-[#414751]]="activeNav() !== 'cluster'"
          [class.hover:bg-[#e5eeff]]="activeNav() !== 'cluster'"
          class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <span class="material-symbols-outlined text-[18px]">hub</span>
          <span>Cluster Topology</span>
        </button>

        <button
          type="button"
          (click)="activeNav.set('pipelines')"
          [class.bg-[#004e89]]="activeNav() === 'pipelines'"
          [class.text-white]="activeNav() === 'pipelines'"
          [class.text-[#414751]]="activeNav() !== 'pipelines'"
          [class.hover:bg-[#e5eeff]]="activeNav() !== 'pipelines'"
          class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left"
        >
          <span class="material-symbols-outlined text-[18px]">conversion_path</span>
          <span>Pipelines &amp; CI/CD</span>
        </button>

        <button
          type="button"
          (click)="activeNav.set('telemetry')"
          [class.bg-[#004e89]]="activeNav() === 'telemetry'"
          [class.text-white]="activeNav() === 'telemetry'"
          [class.text-[#414751]]="activeNav() !== 'telemetry'"
          [class.hover:bg-[#e5eeff]]="activeNav() !== 'telemetry'"
          class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left"
        >
          <span class="material-symbols-outlined text-[18px]">monitoring</span>
          <span>Live Telemetry</span>
        </button>

        <button
          type="button"
          (click)="activeNav.set('security')"
          [class.bg-[#004e89]]="activeNav() === 'security'"
          [class.text-white]="activeNav() === 'security'"
          [class.text-[#414751]]="activeNav() !== 'security'"
          [class.hover:bg-[#e5eeff]]="activeNav() !== 'security'"
          class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left"
        >
          <span class="material-symbols-outlined text-[18px]">verified_user</span>
          <span>Security &amp; IAM</span>
        </button>

        <button
          type="button"
          (click)="activeNav.set('nodes')"
          [class.bg-[#004e89]]="activeNav() === 'nodes'"
          [class.text-white]="activeNav() === 'nodes'"
          [class.text-[#414751]]="activeNav() !== 'nodes'"
          [class.hover:bg-[#e5eeff]]="activeNav() !== 'nodes'"
          class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left"
        >
          <span class="material-symbols-outlined text-[18px]">dns</span>
          <span>Node Registry</span>
        </button>
      </nav>
    </div>

    <!-- FOOTER SECURITY STATUS -->
    <div class="pt-3 border-t border-[#c1c7d3]/50">
      <div class="p-3 rounded-lg bg-[#eff4ff] border border-[#c1c7d3]/60">
        <div class="flex items-center justify-between mb-1">
          <span class="text-[10px] font-mono font-semibold text-[#717782]">SECURITY LEVEL</span>
          <span class="text-[10px] font-mono text-[#004e89] font-bold">STAGE-IV</span>
        </div>
        <div class="text-xs font-mono font-semibold text-[#0b1c30]">Munich VPC-9104</div>
      </div>
    </div>
  </aside>

  <!-- MAIN SCROLLABLE CONTENT -->
  <div class="pl-64">
    <main class="w-full pt-16 min-h-screen bg-[#f8f9ff]">
      <div class="p-6 lg:p-8 space-y-6">

        <!-- TOP CONTEXT SWITCHER CARD -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#c1c7d3]/50 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-[#0066b1] flex items-center justify-center text-white shadow-sm">
              <span class="material-symbols-outlined text-[24px]">shield_person</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-base font-semibold text-[#0b1c30]">IT Hub Gateway Environment</span>
                <span class="px-2 py-0.5 rounded bg-[#dce9ff] text-[#004e89] font-mono text-[11px] font-bold">v4.8.2-PROD</span>
              </div>
              <p class="text-xs text-[#5b637a]">Select operational context: Multi-Factor Authentication Entry or Live Connected Operations Suite.</p>
            </div>
          </div>

          <div class="flex items-center bg-[#eff4ff] p-1 rounded-lg border border-[#c1c7d3]/40 self-start md:self-auto">
            <button
              type="button"
              (click)="setViewMode('auth')"
              [class.bg-white]="viewMode() === 'auth'"
              [class.text-[#004e89]]="viewMode() === 'auth'"
              [class.shadow-sm]="viewMode() === 'auth'"
              [class.font-semibold]="viewMode() === 'auth'"
              [class.text-[#5b637a]]="viewMode() !== 'auth'"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
            >
              <span class="material-symbols-outlined text-[16px]">lock</span>
              <span>Gateway Login</span>
            </button>

            <button
              type="button"
              (click)="setViewMode('dash')"
              [class.bg-white]="viewMode() === 'dash'"
              [class.text-[#004e89]]="viewMode() === 'dash'"
              [class.shadow-sm]="viewMode() === 'dash'"
              [class.font-semibold]="viewMode() === 'dash'"
              [class.text-[#5b637a]]="viewMode() !== 'dash'"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
            >
              <span class="material-symbols-outlined text-[16px]">grid_view</span>
              <span>Intranet Dashboard</span>
              <span class="w-1.5 h-1.5 rounded-full bg-[#5291fe]"></span>
            </button>

            <button
              type="button"
              (click)="setViewMode('both')"
              [class.bg-white]="viewMode() === 'both'"
              [class.text-[#004e89]]="viewMode() === 'both'"
              [class.shadow-sm]="viewMode() === 'both'"
              [class.font-semibold]="viewMode() === 'both'"
              [class.text-[#5b637a]]="viewMode() !== 'both'"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
            >
              <span class="material-symbols-outlined text-[16px]">splitscreen</span>
              <span>Dual Architecture</span>
            </button>
          </div>
        </div>

        <!-- AUTHENTICATION GATEWAY CARD -->
        <section *ngIf="viewMode() === 'auth' || viewMode() === 'both'" class="w-full flex justify-center py-2 transition-all">
          <div class="w-full max-w-xl bg-white rounded-xl border border-[#c1c7d3]/60 shadow-md overflow-hidden relative">
            <div class="h-1.5 w-full bg-gradient-to-r from-[#004e89] via-[#0066b1] to-[#5291fe]"></div>

            <div class="p-6 sm:p-8 space-y-6">
              <!-- HEADER -->
              <div class="flex items-start justify-between">
                <div class="space-y-1">
                  <div class="flex items-center gap-1.5">
                    <span class="font-mono text-[10px] text-[#004e89] font-bold tracking-wider uppercase">BMW GROUP IT HUB</span>
                    <span class="text-slate-300 font-mono text-[10px]">•</span>
                    <span class="font-mono text-[10px] text-[#5b637a] font-medium">Identity Gateway</span>
                  </div>
                  <h1 class="text-2xl font-bold text-[#0b1c30] tracking-tight">DevOps Group Gateway Access</h1>
                  <p class="text-xs text-[#5b637a]">Cryptographic mutual authentication for Munich Plant 01 cluster environments.</p>
                </div>

                <div class="hidden sm:flex flex-col items-end">
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#eff4ff] text-[#004e89] font-mono text-[10px] font-semibold border border-[#c1c7d3]/40">
                    <span class="material-symbols-outlined text-[13px]">verified</span>
                    TIER-3 RESTRICTED
                  </span>
                  <span class="font-mono text-[9px] text-[#717782] mt-1 font-semibold">ISO-27001 HARDENED</span>
                </div>
              </div>

              <!-- HSM STATUS -->
              <div class="p-3 rounded-lg bg-[#eff4ff] border border-[#c1c7d3]/40 flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <span class="material-symbols-outlined text-[#004e89] text-[20px]">vpn_lock</span>
                  <div class="flex flex-col">
                    <span class="text-xs font-semibold text-[#0b1c30]">Hardware Enclave HSM</span>
                    <span class="font-mono text-[10px] text-[#5b637a]">Munich VPC Root CA #9914</span>
                  </div>
                </div>
                <span class="font-mono text-[10px] px-2 py-0.5 rounded bg-[#dce9ff] text-[#004e89] font-bold">ONLINE</span>
              </div>

              <!-- FORM -->
              <form (ngSubmit)="handleLogin()" class="space-y-4">
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between">
                    <label class="text-xs font-semibold text-[#0b1c30]">Username / Corporate ID</label>
                    <span class="font-mono text-[10px] text-[#004e89] font-semibold flex items-center gap-1">
                      <span class="material-symbols-outlined text-[12px]">check_circle</span> Active Directory Sync
                    </span>
                  </div>
                  <div class="relative flex items-center">
                    <span class="material-symbols-outlined absolute left-3 text-[#717782] text-[18px]">account_circle</span>
                    <input
                      type="email"
                      [ngModel]="username()"
                      (ngModelChange)="username.set($event)"
                      name="username"
                      required
                      class="w-full pl-10 pr-3 py-2 bg-white border border-[#c1c7d3] rounded-lg text-xs text-[#0b1c30] shadow-sm focus:outline-none focus:border-[#004e89]"
                    />
                  </div>
                </div>

                <div class="space-y-1.5">
                  <div class="flex items-center justify-between">
                    <label class="text-xs font-semibold text-[#0b1c30]">Department Code (FG Matrix)</label>
                    <span class="font-mono text-[10px] text-[#717782]">Format: FG-X-XX-XX</span>
                  </div>
                  <div class="relative flex items-center">
                    <span class="material-symbols-outlined absolute left-3 text-[#717782] text-[18px]">domain</span>
                    <input
                      type="text"
                      [ngModel]="departmentCode()"
                      (ngModelChange)="departmentCode.set($event)"
                      name="departmentCode"
                      required
                      class="w-full pl-10 pr-3 py-2 bg-white border border-[#c1c7d3] rounded-lg font-mono text-xs tracking-wider uppercase text-[#0b1c30] shadow-sm focus:outline-none focus:border-[#004e89]"
                    />
                  </div>
                  <div class="flex items-center gap-1.5 pt-0.5">
                    <span class="material-symbols-outlined text-[#5291fe] text-[14px]">info</span>
                    <span class="text-[11px] text-[#5b637a]">Munich Plant 01.10 - Vehicle Architecture Platform Group</span>
                  </div>
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-[#0b1c30]">Assigned Operational Role</label>
                  <div class="relative flex items-center">
                    <span class="material-symbols-outlined absolute left-3 text-[#717782] text-[18px]">badge</span>
                    <select
                      [ngModel]="selectedRole()"
                      (ngModelChange)="selectedRole.set($event)"
                      name="selectedRole"
                      class="w-full pl-10 pr-8 py-2 bg-white border border-[#c1c7d3] rounded-lg text-xs text-[#0b1c30] shadow-sm focus:outline-none focus:border-[#004e89] appearance-none cursor-pointer"
                    >
                      <option>DevOps Cluster Administrator (Full Access)</option>
                      <option>Technical Lead &amp; Release Auditor</option>
                      <option>Plant Assembly Robotics Integrator</option>
                      <option>Site Reliability Engineer (On-Call SRE)</option>
                    </select>
                    <span class="material-symbols-outlined absolute right-3 text-[#717782] text-[18px] pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div class="pt-1">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#eff4ff] p-3 rounded-lg border border-[#c1c7d3]/40">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        [ngModel]="rememberWorkstation()"
                        (ngModelChange)="rememberWorkstation.set($event)"
                        name="rememberWorkstation"
                        class="w-4 h-4 rounded text-[#004e89] focus:ring-0 cursor-pointer"
                      />
                      <span class="text-xs text-[#0b1c30]">Remember certified terminal workstation</span>
                    </label>
                    <div class="flex items-center gap-1.5 font-mono text-[11px]">
                      <span class="text-[#5b637a]">YubiKey / FIDO2:</span>
                      <span class="text-[#004e89] font-bold">READY</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  class="w-full py-2.5 px-4 rounded-lg bg-[#0066b1] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm hover:bg-[#004e89] transition-all cursor-pointer"
                >
                  <span class="material-symbols-outlined text-[18px]">login</span>
                  <span>Authenticate &amp; Enter Portal</span>
                  <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </form>

              <!-- MUTUAL TLS FOOTNOTE -->
              <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 text-center font-mono text-[10px] text-[#5b637a]">
                <span class="flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#5291fe]"></span>
                  Mutual TLS 1.3 Certified
                </span>
                <span class="text-slate-300 hidden sm:inline">·</span>
                <span>Hardware Enclave HSM Validated</span>
                <span class="text-slate-300 hidden sm:inline">·</span>
                <span>Bavaria Root Node #01</span>
              </div>
            </div>
          </div>
        </section>

        <!-- INTRANET WORKSPACE (CONNECTED DEVOPS MATRIX) -->
        <section *ngIf="viewMode() === 'dash' || viewMode() === 'both'" class="w-full space-y-6">
          <!-- CONTEXT BANNER WITH TELEMETRY STATS -->
          <div class="bg-white rounded-xl p-6 border border-[#c1c7d3]/50 shadow-sm relative overflow-hidden">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div class="space-y-1.5">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="px-2 py-0.5 rounded bg-[#004e89] text-white font-mono text-[10px] font-bold">PLANT MUNICH 01.10</span>
                  <span class="font-mono text-[11px] text-[#5b637a]">FITZGERALD-RING 41</span>
                  <span class="text-slate-300">•</span>
                  <span class="font-mono text-[11px] text-[#004e89] font-semibold">ZONE DE-MUC-AZ-1</span>
                </div>
                <h2 class="text-2xl font-bold text-[#0b1c30] tracking-tight">Connected DevOps Matrix</h2>
                <p class="text-xs text-[#5b637a]">Automated vehicle assembly integration pipelines, Over-The-Air deployment verification, and zero-trust cluster state.</p>
              </div>

              <!-- 4 TELEMETRY STAT CARDS -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="p-3 rounded-lg bg-[#eff4ff] border border-[#c1c7d3]/40 flex flex-col">
                  <span class="font-mono text-[10px] text-[#5b637a] uppercase font-semibold">Build Pipelines</span>
                  <div class="flex items-center gap-1 mt-1">
                    <span class="font-mono text-base font-bold text-[#0b1c30]">99.94%</span>
                    <span class="material-symbols-outlined text-[#004e89] text-[16px]">trending_up</span>
                  </div>
                  <span class="text-[11px] text-[#004e89] font-semibold">Healthy Status</span>
                </div>

                <div class="p-3 rounded-lg bg-[#eff4ff] border border-[#c1c7d3]/40 flex flex-col">
                  <span class="font-mono text-[10px] text-[#5b637a] uppercase font-semibold">Cluster Nodes</span>
                  <div class="flex items-center gap-1 mt-1">
                    <span class="font-mono text-base font-bold text-[#0b1c30]">128</span>
                    <span class="font-mono text-xs text-[#717782]">/ 128</span>
                  </div>
                  <span class="text-[11px] text-[#5b637a]">0 Standby Drain</span>
                </div>

                <div class="p-3 rounded-lg bg-[#eff4ff] border border-[#c1c7d3]/40 flex flex-col">
                  <span class="font-mono text-[10px] text-[#5b637a] uppercase font-semibold">Security State</span>
                  <div class="flex items-center gap-1 mt-1">
                    <span class="font-mono text-base font-bold text-[#0b1c30]">100%</span>
                    <span class="material-symbols-outlined text-[#004e89] text-[15px]">lock</span>
                  </div>
                  <span class="text-[11px] text-[#004e89] font-semibold">mTLS Enforced</span>
                </div>

                <div class="p-3 rounded-lg bg-[#eff4ff] border border-[#c1c7d3]/40 flex flex-col">
                  <span class="font-mono text-[10px] text-[#5b637a] uppercase font-semibold">OTA Queue</span>
                  <div class="flex items-center gap-1 mt-1">
                    <span class="font-mono text-base font-bold text-[#0b1c30]">14</span>
                    <span class="text-xs text-[#5b637a]">Vehicles</span>
                  </div>
                  <span class="text-[11px] text-[#0066b1] font-semibold">Active Sync</span>
                </div>
              </div>
            </div>
          </div>

          <!-- SPLIT WORKBENCH GRID -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

            <!-- LEFT COL: ASSEMBLY TASK SHEET (5 cols) -->
            <div class="xl:col-span-5 bg-white rounded-xl border border-[#c1c7d3]/50 shadow-sm overflow-hidden flex flex-col">
              <!-- HEADER -->
              <div class="p-4 bg-[#eff4ff] border-b border-[#c1c7d3]/40 flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-[#0066b1] text-white flex items-center justify-center">
                    <span class="material-symbols-outlined text-[18px]">precision_manufacturing</span>
                  </div>
                  <div>
                    <h3 class="text-sm font-semibold text-[#0b1c30]">Assembly Task Sheet</h3>
                    <span class="font-mono text-[10px] text-[#5b637a]">PLANT-LINE-MUC-04 // ROBOTICS CI/CD</span>
                  </div>
                </div>
                <span class="px-2.5 py-0.5 rounded-md bg-white border border-[#c1c7d3]/50 text-[#004e89] font-mono text-[10px] font-bold flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-[#0066b1] animate-ping"></span> LIVE
                </span>
              </div>

              <!-- ACTIVE FLASH HIGHLIGHT -->
              <div class="p-4 bg-[#eff4ff]/40 border-b border-[#c1c7d3]/30">
                <div class="p-4 bg-white rounded-lg border border-[#c1c7d3]/50 shadow-sm space-y-3">
                  <div class="flex items-start justify-between">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="px-2 py-0.5 rounded bg-[#eff4ff] text-[#004e89] font-mono text-[10px] font-bold">ACTIVE FLASH</span>
                        <span class="font-mono text-[10px] text-[#5b637a]">Target: Munich Line 04</span>
                      </div>
                      <h4 class="text-sm font-semibold text-[#0b1c30] mt-1">ECU Firmware Flash v4.18.2</h4>
                      <p class="text-xs text-[#5b637a]">Vehicle Program: BMW i4 M50 (Chassis #WBA0039420)</p>
                    </div>
                    <span class="px-2.5 py-1 rounded-md bg-[#dce9ff] text-[#004e89] font-mono text-[10px] font-semibold">
                      IN PROGRESS ({{ flashProgress() }}%)
                    </span>
                  </div>

                  <!-- PROGRESS BAR -->
                  <div class="space-y-1">
                    <div class="w-full bg-[#e5eeff] rounded-full h-2 overflow-hidden">
                      <div
                        class="bg-[#004e89] h-full rounded-full transition-all duration-500"
                        [style.width.%]="flashProgress()"
                      ></div>
                    </div>
                    <div class="flex justify-between font-mono text-[11px] text-[#5b637a]">
                      <span>CAN-Bus Ingestion: Block {{ currentBlock() }} of {{ totalBlocks() }}</span>
                      <span class="text-[#004e89] font-semibold">ETA: {{ etaSeconds() }}s</span>
                    </div>
                  </div>

                  <!-- CHECKS -->
                  <div class="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                    <div class="flex items-center gap-1 text-[#004e89] font-mono text-[10px] font-medium">
                      <span class="material-symbols-outlined text-[15px]">verified</span>
                      Automated Tests Verified
                    </div>
                    <div class="flex items-center gap-1 text-[#004e89] font-mono text-[10px] font-medium justify-end">
                      <span class="material-symbols-outlined text-[15px]">security</span>
                      Rollback Safety Armed
                    </div>
                  </div>
                </div>
              </div>

              <!-- TASK QUEUE LIST -->
              <div class="p-4 space-y-3">
                <span class="font-mono text-[10px] text-[#5b637a] uppercase font-bold tracking-wider">Immediate Execution Queue</span>

                <div class="space-y-2">
                  <div
                    *ngFor="let item of queueItems"
                    class="p-3 rounded-lg bg-[#eff4ff]/60 border border-[#c1c7d3]/40 hover:bg-[#eff4ff] transition-all flex flex-col gap-1"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-semibold text-[#0b1c30]">{{ item.title }}</span>
                      <span
                        [class.bg-[#dce9ff]]="item.status === 'QUEUED' || item.status === 'VERIFYING'"
                        [class.text-[#004e89]]="item.status === 'QUEUED' || item.status === 'VERIFYING'"
                        [class.bg-emerald-100]="item.status === 'COMPLETED'"
                        [class.text-emerald-800]="item.status === 'COMPLETED'"
                        class="px-2 py-0.5 rounded font-mono text-[9px] font-semibold"
                      >
                        {{ item.status }}
                      </span>
                    </div>

                    <div class="flex items-center justify-between text-[#5b637a] text-xs">
                      <span>{{ item.lineCell }}</span>
                      <span class="font-mono text-[10px] font-medium" [class.text-[#004e89]]="item.status === 'COMPLETED'">
                        {{ item.countdown }}
                      </span>
                    </div>

                    <div class="flex items-center justify-between pt-1 border-t border-[#c1c7d3]/20 font-mono text-[10px]">
                      <span class="text-[#5b637a]">Eng: <strong class="text-[#0b1c30]">{{ item.engineer }}</strong> ({{ item.roleTag }})</span>
                      <span class="text-[#717782]">{{ item.jobCode }}</span>
                    </div>
                  </div>
                </div>

                <div class="pt-2 flex justify-between items-center border-t border-[#c1c7d3]/30">
                  <button
                    type="button"
                    (click)="openHotfixModal()"
                    class="font-mono text-xs text-[#004e89] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span class="material-symbols-outlined text-[16px]">add_circle</span> Inject Hotfix Task
                  </button>
                  <span class="font-mono text-[10px] text-[#5b637a]">Worker Nodes: 16 Healthy</span>
                </div>
              </div>
            </div>

            <!-- RIGHT COL: AUDITS & SYSTEM CONTROLS (7 cols) -->
            <div class="xl:col-span-7 space-y-6">

              <!-- CARD: TECHNICAL CAMPAIGN AUDITS -->
              <div class="bg-white rounded-xl border border-[#c1c7d3]/50 shadow-sm overflow-hidden">
                <div class="p-4 bg-[#eff4ff] border-b border-[#c1c7d3]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-[#0066b1] text-white flex items-center justify-center">
                      <span class="material-symbols-outlined text-[18px]">verified_user</span>
                    </div>
                    <div>
                      <h3 class="text-sm font-semibold text-[#0b1c30]">#reports · Technical Campaign Audits</h3>
                      <span class="font-mono text-[10px] text-[#5b637a]">COMPLIANCE &amp; CRYPTOGRAPHIC LEDGER</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    (click)="openConfirmation('Export Cryptographic Ledger')"
                    class="px-3 py-1.5 rounded-lg bg-white border border-[#c1c7d3] text-[#0b1c30] font-mono text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                  >
                    <span class="material-symbols-outlined text-[16px]">file_download</span>
                    Export Ledger (PDF/A)
                  </button>
                </div>

                <!-- FILTER TABS -->
                <div class="px-4 py-2 border-b border-[#c1c7d3]/30 flex items-center gap-1 overflow-x-auto bg-[#eff4ff]/30">
                  <button
                    type="button"
                    (click)="selectedAuditTab.set('all')"
                    [class.bg-[#004e89]]="selectedAuditTab() === 'all'"
                    [class.text-white]="selectedAuditTab() === 'all'"
                    [class.text-[#5b637a]]="selectedAuditTab() !== 'all'"
                    class="px-3 py-1 rounded-md text-xs font-mono font-semibold whitespace-nowrap cursor-pointer"
                  >
                    All Audits (1,492)
                  </button>
                  <button
                    type="button"
                    (click)="selectedAuditTab.set('ota')"
                    [class.bg-[#004e89]]="selectedAuditTab() === 'ota'"
                    [class.text-white]="selectedAuditTab() === 'ota'"
                    [class.text-[#5b637a]]="selectedAuditTab() !== 'ota'"
                    class="px-3 py-1 rounded-md text-xs font-mono font-medium hover:bg-slate-100 whitespace-nowrap cursor-pointer"
                  >
                    OTA Flash Campaigns
                  </button>
                  <button
                    type="button"
                    (click)="selectedAuditTab.set('safety')"
                    [class.bg-[#004e89]]="selectedAuditTab() === 'safety'"
                    [class.text-white]="selectedAuditTab() === 'safety'"
                    [class.text-[#5b637a]]="selectedAuditTab() !== 'safety'"
                    class="px-3 py-1 rounded-md text-xs font-mono font-medium hover:bg-slate-100 whitespace-nowrap cursor-pointer"
                  >
                    Safety Telemetry
                  </button>
                  <button
                    type="button"
                    (click)="selectedAuditTab.set('ecu')"
                    [class.bg-[#004e89]]="selectedAuditTab() === 'ecu'"
                    [class.text-white]="selectedAuditTab() === 'ecu'"
                    [class.text-[#5b637a]]="selectedAuditTab() !== 'ecu'"
                    class="px-3 py-1 rounded-md text-xs font-mono font-medium hover:bg-slate-100 whitespace-nowrap cursor-pointer"
                  >
                    ECU Conformance
                  </button>
                </div>

                <!-- AUDIT HIGHLIGHT AND LIST -->
                <div class="p-4 space-y-4">
                  <!-- HIGHLIGHT RECORD -->
                  <div class="p-4 rounded-xl bg-[#eff4ff] border border-[#c1c7d3]/50 space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div class="flex items-center gap-2">
                        <span class="font-mono text-xs font-bold text-[#004e89]">#AUD-BMW-9842</span>
                        <span class="px-2 py-0.5 rounded bg-[#dce9ff] text-[#004e89] font-mono text-[10px] font-bold">CERTIFIED</span>
                        <span class="font-mono text-xs text-[#5b637a]">Series G26 / i4 Gran Coupe</span>
                      </div>
                      <span class="font-mono text-[10px] text-[#717782]">2025-05-18 09:14:22 UTC</span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div class="space-y-0.5">
                        <span class="font-mono text-[10px] text-[#5b637a] uppercase">Cryptographic Signature</span>
                        <p class="font-mono text-xs text-[#0b1c30] break-all">ECDSA P-384 / SHA3-512 [OK]</p>
                      </div>
                      <div class="space-y-0.5">
                        <span class="font-mono text-[10px] text-[#5b637a] uppercase">Compliance Score</span>
                        <p class="text-base font-bold text-[#004e89]">99.8% <span class="text-xs font-normal text-[#5b637a]">Pass</span></p>
                      </div>
                      <div class="space-y-0.5">
                        <span class="font-mono text-[10px] text-[#5b637a] uppercase">Auditor / Enclave</span>
                        <p class="font-mono text-xs text-[#0b1c30]">Dr. F. Weber (FG-9-ZA-72)</p>
                      </div>
                    </div>

                    <div class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#c1c7d3]/30">
                      <span class="text-xs text-[#5b637a]">Target ECUs: <strong class="text-[#0b1c30]">ADAS-Domain, Brake-By-Wire, In-Vehicle Gateway</strong></span>
                      <button
                        type="button"
                        (click)="openConfirmation('Download Audit Sign-Off Report')"
                        class="px-3 py-1.5 rounded-lg bg-[#0066b1] text-white font-mono text-xs font-semibold hover:bg-[#004e89] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <span class="material-symbols-outlined text-[15px]">description</span>
                        Download Audit Sign-Off Report
                      </button>
                    </div>
                  </div>

                  <!-- RECENT AUDITS TABLE -->
                  <div class="overflow-x-auto border border-[#c1c7d3]/40 rounded-lg">
                    <table class="w-full text-left font-sans text-xs">
                      <thead class="bg-[#eff4ff] font-mono text-[10px] text-[#5b637a] uppercase tracking-wider">
                        <tr>
                          <th class="py-2.5 px-3">Audit ID</th>
                          <th class="py-2.5 px-3">Vehicle Series</th>
                          <th class="py-2.5 px-3">Signing Alg</th>
                          <th class="py-2.5 px-3">Score</th>
                          <th class="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-[#c1c7d3]/30 font-mono text-xs">
                        <tr *ngFor="let audit of audits" class="hover:bg-[#eff4ff]/40 transition-colors">
                          <td class="py-2.5 px-3 font-bold text-[#0b1c30]">{{ audit.id }}</td>
                          <td class="py-2.5 px-3 text-[#0b1c30] font-sans">{{ audit.series }}</td>
                          <td class="py-2.5 px-3 text-[#5b637a]">{{ audit.algorithm }}</td>
                          <td class="py-2.5 px-3 text-[#004e89] font-bold">{{ audit.score }}</td>
                          <td class="py-2.5 px-3 text-right font-sans">
                            <button
                              type="button"
                              (click)="openConfirmation('Inspect Audit ' + audit.id)"
                              class="text-[#004e89] hover:underline font-semibold cursor-pointer"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!-- CARD: SYSTEM ADMINISTRATION CONTROLS -->
              <div class="bg-white rounded-xl border border-[#c1c7d3]/50 shadow-sm overflow-hidden">
                <div class="p-4 bg-[#eff4ff] border-b border-[#c1c7d3]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
                      <span class="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <h3 class="text-sm font-semibold text-[#0b1c30]">System Administration Controls</h3>
                        <span class="px-2 py-0.5 rounded bg-[#ba1a1a] text-white font-mono text-[9px] font-bold">RESTRICTED</span>
                      </div>
                      <span class="font-mono text-[10px] text-[#5b637a]">PRIVILEGED ACCESS LEVEL: ROOT DEVOPS OPERATOR</span>
                    </div>
                  </div>
                  <span class="font-mono text-[10px] px-2.5 py-1 rounded bg-[#dce9ff] text-[#004e89] font-bold">HSM SESSION ACTIVE</span>
                </div>

                <div class="p-4 space-y-4">
                  <!-- 2x2 TOGGLES GRID -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <!-- TOGGLE 1 -->
                    <div class="p-3 rounded-lg bg-[#eff4ff] border border-[#c1c7d3]/40 flex items-center justify-between">
                      <div class="space-y-0.5">
                        <span class="text-xs font-semibold text-[#0b1c30]">Cluster Failover Switch</span>
                        <p class="font-mono text-[10px] text-[#5b637a]">Route traffic to Standby Munich-East</p>
                      </div>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          [ngModel]="clusterFailover()"
                          (ngModelChange)="clusterFailover.set($event)"
                          class="sr-only peer"
                        />
                        <div class="w-10 h-5 bg-[#c1c7d3] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#004e89]"></div>
                      </label>
                    </div>

                    <!-- TOGGLE 2 -->
                    <div class="p-3 rounded-lg bg-[#eff4ff] border border-[#c1c7d3]/40 flex items-center justify-between">
                      <div class="space-y-0.5">
                        <span class="text-xs font-semibold text-[#0b1c30]">Ingress Rate Throttling</span>
                        <p class="font-mono text-[10px] text-[#5b637a]">Clamp production API limit (50k req/s)</p>
                      </div>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          [ngModel]="ingressThrottling()"
                          (ngModelChange)="ingressThrottling.set($event)"
                          class="sr-only peer"
                        />
                        <div class="w-10 h-5 bg-[#c1c7d3] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#004e89]"></div>
                      </label>
                    </div>

                    <!-- ACTION 3 -->
                    <div class="p-3 rounded-lg bg-[#eff4ff] border border-[#c1c7d3]/40 flex items-center justify-between">
                      <div class="space-y-0.5">
                        <span class="text-xs font-semibold text-[#0b1c30]">Zero-Trust Token Revocation</span>
                        <p class="font-mono text-[10px] text-[#5b637a]">Flush non-hardware OAuth sessions</p>
                      </div>
                      <button
                        type="button"
                        (click)="openConfirmation('Flush Zero-Trust OAuth Tokens')"
                        class="px-2.5 py-1 rounded-md bg-white border border-[#c1c7d3] text-[#0b1c30] font-mono text-[11px] font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Flush Now
                      </button>
                    </div>

                    <!-- ACTION 4 -->
                    <div class="p-3 rounded-lg bg-[#eff4ff] border border-[#c1c7d3]/40 flex items-center justify-between">
                      <div class="space-y-0.5">
                        <span class="text-xs font-semibold text-[#0b1c30]">Emergency Lockout Protocol</span>
                        <p class="font-mono text-[10px] text-[#5b637a]">Halt all Line 01-08 pipeline runners</p>
                      </div>
                      <span class="font-mono text-[10px] px-2 py-0.5 rounded bg-[#e5eeff] text-[#5b637a] font-bold">
                        {{ emergencyLockdownArmed() ? 'ENGAGED' : 'STANDBY' }}
                      </span>
                    </div>
                  </div>

                  <!-- BOTTOM ACTIONS CLUSTER -->
                  <div class="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#c1c7d3]/30">
                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        (click)="openConfirmation('Purge Stale Artifacts')"
                        class="px-3 py-2 rounded-lg bg-[#eff4ff] border border-[#c1c7d3]/60 text-[#0b1c30] text-xs font-semibold hover:bg-[#e5eeff] transition-colors cursor-pointer"
                      >
                        Purge Stale Artifacts
                      </button>
                      <button
                        type="button"
                        (click)="openConfirmation('Rotate Signing Keys')"
                        class="px-3 py-2 rounded-lg bg-[#eff4ff] border border-[#c1c7d3]/60 text-[#0b1c30] text-xs font-semibold hover:bg-[#e5eeff] transition-colors cursor-pointer"
                      >
                        Rotate Signing Keys
                      </button>
                    </div>

                    <button
                      type="button"
                      (click)="triggerEmergencyLockdown()"
                      class="px-4 py-2 rounded-lg bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold hover:bg-[#ba1a1a] hover:text-white transition-all flex items-center gap-1.5 border border-red-200 cursor-pointer"
                    >
                      <span class="material-symbols-outlined text-[18px]">gavel</span>
                      Execute Emergency Lockdown
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </main>
  </div>

  <!-- CONFIRMATION / ACTION MODAL -->
  <div
    *ngIf="activeModal()"
    class="fixed inset-0 z-50 bg-[#0b1c30]/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all"
  >
    <div class="bg-white max-w-md w-full rounded-xl shadow-2xl border border-[#c1c7d3] overflow-hidden">
      <div class="p-4 bg-[#eff4ff] border-b border-[#c1c7d3]/50 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span
            class="material-symbols-outlined text-[22px]"
            [class.text-[#ba1a1a]]="activeModal() === 'lockdown'"
            [class.text-[#004e89]]="activeModal() !== 'lockdown'"
          >
            {{ activeModal() === 'lockdown' ? 'warning' : 'admin_panel_settings' }}
          </span>
          <span class="text-sm font-semibold text-[#0b1c30]">{{ modalTitle() }}</span>
        </div>
        <button (click)="closeModal()" class="text-[#717782] hover:text-[#0b1c30]">
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      <div class="p-6 space-y-4">
        <p class="text-xs text-[#0b1c30] leading-relaxed">{{ modalMessage() }}</p>
        <div class="p-2.5 rounded-lg bg-[#eff4ff] font-mono text-[10px] text-[#5b637a]">
          Security Stamp: FG-9-ZA-72 // HSM-CERT-2025 // MUNICH-AZ-1
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button
            type="button"
            (click)="closeModal()"
            class="px-3 py-1.5 rounded-lg border border-[#c1c7d3] text-xs font-semibold text-[#0b1c30] hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            (click)="confirmModalAction()"
            [class.bg-[#ba1a1a]]="activeModal() === 'lockdown'"
            [class.bg-[#004e89]]="activeModal() !== 'lockdown'"
            class="px-4 py-1.5 rounded-lg text-white text-xs font-semibold shadow-sm hover:opacity-90"
          >
            Confirm &amp; Execute
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
`;

export const ANGULAR_COMPONENT_CSS = `/* Component scoped styles for BMW Group IT Hub DevOps dashboard */

@keyframes spinSlow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spinSlow 8s linear infinite;
}

:host {
  display: block;
  font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #0b1c30;
  background-color: #f8f9ff;
}

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  line-height: 1;
  display: inline-block;
  white-space: nowrap;
}
`;
