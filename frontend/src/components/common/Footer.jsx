import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              <span className="text-xl font-extrabold text-white">
                Civic<span className="text-emerald-400">Impact</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An integrated Smart City, Civic Responsibility, and Waste Management platform designed to empower citizens and municipalities towards a cleaner, circular future.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <Sparkles size={14} />
              <span>College Semester Project Demo</span>
            </div>
          </div>

          {/* Civic Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3">Civic Modules</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/complaints" className="hover:text-emerald-400 transition">
                  Report Civic Issues
                </Link>
              </li>
              <li>
                <Link to="/pickup" className="hover:text-emerald-400 transition">
                  Doorstep Waste Pickup
                </Link>
              </li>
              <li>
                <Link to="/reuse" className="hover:text-emerald-400 transition">
                  Donate & Reuse Marketplace
                </Link>
              </li>
              <li>
                <Link to="/recycling" className="hover:text-emerald-400 transition">
                  Recycling Centres Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Education & Community */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3">Smart Tools & Learn</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/assistant" className="hover:text-emerald-400 transition">
                  "What Should I Do?" Assistant
                </Link>
              </li>
              <li>
                <Link to="/education" className="hover:text-emerald-400 transition">
                  Waste Segregation Guide
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-emerald-400 transition">
                  Community Green Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition">
                  Citizen Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Municipal Helpline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3">Municipal Helpline</h4>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold">
                <PhoneCall size={14} />
                <span>24/7 Civic Control Room</span>
              </div>
              <p className="text-[11px] text-slate-400">Toll Free: 1800-CIVIC-GOV (1800-248-4246)</p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span>Verified City Operations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Civic Impact. Built for Sustainable Cities & Communities.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with care for environmental responsibility</span>
            <Heart size={12} className="text-rose-500 inline fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
