'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface Proposal {
  id: string;
  tender_title: string;
  proposal: string;
  proposed_budget: number;
  proposed_timeline: string;
  created_at: string;
}

export default function MyProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to view your proposals.');
      return;
    }

    axios
      .get('http://localhost:5000/api/application/my-proposals', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setProposals(res.data.proposals))
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Failed to fetch proposals.');
        toast.error('Something went wrong while loading proposals.');
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-medium text-lg">
        {error}
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 text-lg">
        You haven’t submitted any proposals yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-slate-800 text-center">📄 My Proposals</h1>

        {proposals.map((p) => (
          <Card key={p.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-blue-700">
                  {p.tender_title}
                </h2>
                <span className="text-sm text-slate-500">
                  {new Date(p.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div className="text-slate-700 space-y-1">
                <p>
                  <span className="font-medium">💬 Proposal:</span> {p.proposal}
                </p>
                <p>
                  <span className="font-medium">💰 Budget:</span> ₹{p.proposed_budget}
                </p>
                <p>
                  <span className="font-medium">📆 Timeline:</span> {p.proposed_timeline}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}