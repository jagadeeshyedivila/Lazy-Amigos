import React from 'react';
import StatusBadge from './StatusBadge';
import { ArrowUpRight, ArrowDownRight, IndianRupee } from 'lucide-react';
import { getStatusFunnyText } from '../constants/funMessages';

const MemberPaymentCard = ({ member, onAddPayment, onAddAdjustment, isAdmin }) => {
  const hasAdjustments = member.additionAmount > 0 || member.deductionAmount > 0;

  return (
    <div className="glass-panel p-4 rounded-xl flex flex-col justify-between space-y-3 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-350">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-white font-semibold text-base">{member.name}</h4>
          <div className="text-slate-400 text-xs mt-0.5">Payable: ₹{member.finalPayable}</div>
        </div>
        <StatusBadge status={member.status} />
      </div>

      <div className="text-[11px] font-semibold text-brand-300 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800/40 tracking-wide text-center">
        {getStatusFunnyText(member.status, member.memberId)}
      </div>

      {hasAdjustments && (
        <div className="flex flex-wrap gap-2 text-xs py-1 border-t border-slate-800/40 mt-1">
          {member.additionAmount > 0 && (
            <span className="flex items-center text-amber-400">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +{member.additionAmount} Extra
            </span>
          )}
          {member.deductionAmount > 0 && (
            <span className="flex items-center text-emerald-400">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              -{member.deductionAmount} Deduction
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/40">
        <div>
          <span className="text-slate-500 block">Paid</span>
          <span className="text-slate-200 font-medium">₹{member.paid}</span>
        </div>
        <div>
          {member.extra > 0 ? (
            <>
              <span className="text-emerald-500 block">Extra</span>
              <span className="text-emerald-400 font-semibold">₹{member.extra}</span>
            </>
          ) : (
            <>
              <span className="text-slate-500 block">Remaining</span>
              <span className="text-slate-200 font-medium">₹{member.remaining}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex space-x-2 pt-2">
        <button
          onClick={() => onAddPayment(member)}
          className="flex-1 py-1.5 px-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center"
        >
          <IndianRupee className="w-3.5 h-3.5 mr-1" />
          Pay
        </button>
        {isAdmin && (
          <button
            onClick={() => onAddAdjustment(member)}
            className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-350 rounded-lg text-xs font-semibold transition-all"
          >
            Adjust
          </button>
        )}
      </div>
    </div>
  );
};

export default MemberPaymentCard;
