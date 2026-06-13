# Scorpius Networks — NOC Autonomous Operations Demo

A production-grade, multi-page Telecom NOC demo showcasing AI agent-driven autonomous
operations: fault correlation, root-cause analysis, human-in-the-loop remediation, security
incident response, agent observability, and executive intelligence.

The agent architecture is conceptually aligned with Ericsson's white paper on AI agents in
telecom (restricted vs. unrestricted agents, TM Forum IMF, Agent-to-Agent protocol,
guardrails). All data is static/synthetic — no backend.

## Quick Start (Docker — recommended)

```bash
docker-compose up
# App runs at http://localhost:5173
```

## Quick Start (Local)

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```

## Stack

React 18 · TypeScript · Vite · Tailwind CSS v3 · shadcn/ui · Recharts · Framer Motion · Docker Compose

## Pages

| Route                 | Page                       |
| --------------------- | -------------------------- |
| `/`                   | NOC Command Center         |
| `/sites`              | Cell Site Management       |
| `/incidents`          | Incident Correlation ★     |
| `/remediation`        | Autonomous Remediation ★   |
| `/security`           | Security Operations        |
| `/agent-observatory`  | Agent Observatory          |
| `/analytics`          | Analytics & Reports        |
| `/executive`          | Executive Intelligence     |
| `/settings`           | Settings                   |
