'use client';

import React from 'react';
import {
  Search,
  ChevronDown,
  Calendar,
  Download,
  MapPin,
  X,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Wallet,
  Receipt,
  BadgePercent,
  FileDown,
  FileText,
  FileSpreadsheet,
  FileCheck,
  LayoutDashboard,
  GitFork,
  Table2,
  Contact,
  WalletCards,
  Users,
  Plug,
  User,
  Award,
  TrendingUp,
  Landmark,
  BarChart3,
  UserPlus,
  UserCheck,
  ArrowUpDown,
  Megaphone,
  Pill,
  Fuel,
  Sofa,
  Zap,
  Cog,
  Monitor,
  Wrench,
  Shield,
  Package,
  Droplets,
  Building2,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

const iconMap: Record<string, React.FC<LucideProps>> = {
  search: Search,
  'chevron-down': ChevronDown,
  calendar: Calendar,
  download: Download,
  'map-pin': MapPin,
  x: X,
  'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight,
  'arrow-down-right': ArrowDownRight,
  activity: Activity,
  wallet: Wallet,
  receipt: Receipt,
  'badge-percent': BadgePercent,
  'file-down': FileDown,
  'file-text': FileText,
  'file-spreadsheet': FileSpreadsheet,
  'file-check': FileCheck,
  'layout-dashboard': LayoutDashboard,
  'git-fork': GitFork,
  'table-2': Table2,
  contact: Contact,
  'wallet-cards': WalletCards,
  users: Users,
  plug: Plug,
  user: User,
  award: Award,
  'trending-up': TrendingUp,
  landmark: Landmark,
  'bar-chart-3': BarChart3,
  'user-plus': UserPlus,
  'user-check': UserCheck,
  'arrow-up-down': ArrowUpDown,
  megaphone: Megaphone,
  pill: Pill,
  fuel: Fuel,
  sofa: Sofa,
  zap: Zap,
  cog: Cog,
  monitor: Monitor,
  wrench: Wrench,
  shield: Shield,
  package: Package,
  droplets: Droplets,
  'building-2': Building2,
  'log-out': LogOut,
  'alert-circle': AlertCircle,
};

export interface IconProps {
  name: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

export function Icon({
  name,
  size = 18,
  strokeWidth = 1.7,
  color,
  style,
  className,
}: IconProps) {
  const Component = iconMap[name];
  if (!Component) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Icon] Unknown icon name: "${name}"`);
    }
    return null;
  }
  return (
    <Component
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      style={style}
      className={className}
    />
  );
}
