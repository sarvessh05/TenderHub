'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Tender {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
}

export default function TendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeApplyId, setActiveApplyId] = useState<string | null>(null);
  const [proposalText, setProposalText] = useState('');
  const [proposalBudget, setProposalBudget] = useState('');
  const [proposalTimeline, setProposalTimeline] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tender/all?page=${page}&limit=3`);
        setTenders(res.data.tenders);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error('Error fetching tenders:', err);
        toast.error('Failed to load tenders');
      }
    };

    fetchTenders();
  }, [page]);

  const applyToTender = async (tenderId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return toast.error('Login required to apply.');

    if (!proposalText || !proposalBudget || !proposalTimeline) {
      return toast.error('Please fill in all fields.');
    }

    try {
      setSubmitting(true);
      await axios.post(
        'http://localhost:5000/api/application/apply',
        {
          tender_id: tenderId,
          proposal: proposalText,
          proposed_budget: Number(proposalBudget),
          proposed_timeline: proposalTimeline,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('Proposal submitted successfully!');
      setActiveApplyId(null);
      setProposalText('');
      setProposalBudget('');
      setProposalTimeline('');
    } catch (err) {
      console.error('Apply error:', err);
      toast.error('Failed to submit proposal.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-4">📋 Browse Tenders</h1>

      {tenders.map((t) => (
        <Card key={t.id}>
          <CardContent className="p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">{t.title}</h2>
              <p className="text-slate-600 mt-1">{t.description}</p>
              <p className="text-sm text-slate-500 mt-2">💰 Budget: ₹{t.budget}</p>
              <p className="text-sm text-slate-500">📅 Deadline: {new Date(t.deadline).toDateString()}</p>
            </div>

            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setActiveApplyId(activeApplyId === t.id ? null : t.id)}
            >
              {activeApplyId === t.id ? 'Cancel' : 'Apply to Tender'}
            </Button>

            {activeApplyId === t.id && (
              <div className="p-4 border rounded-lg bg-slate-50 space-y-4 animate-in fade-in">
                <Textarea
                  placeholder="Write your proposal..."
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Budget (₹)"
                    value={proposalBudget}
                    onChange={(e) => setProposalBudget(e.target.value)}
                  />
                  <Input
                    placeholder="Timeline (e.g., 10 days)"
                    value={proposalTimeline}
                    onChange={(e) => setProposalTimeline(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => applyToTender(t.id)}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : '🚀 Submit Proposal'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <Button
          variant="outline"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
        >
          ⬅️ Previous
        </Button>
        <span className="text-slate-600 font-medium">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
        >
          Next ➡️
        </Button>
      </div>
    </div>
  );
}