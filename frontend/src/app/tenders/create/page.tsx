'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function CreateTenderPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !budget || !timeline) {
      return toast.error('Please fill in all fields.');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return toast.error('You must be logged in to create a tender.');
    }

    try {
      setLoading(true);

      await axios.post(
        'http://localhost:5000/api/tender/create',
        {
          title,
          description,
          estimated_budget: Number(budget),
          timeline,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Tender created successfully!');
      router.push('/tenders');
    } catch (err) {
      console.error('Error creating tender:', err);
      toast.error('Failed to create tender.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8 space-y-6">
          <h1 className="text-3xl font-bold text-slate-800 text-center">Create New Tender</h1>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="E.g. Web App Development"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Details, requirements, expectations..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">Estimated Budget (₹)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="E.g. 15000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="timeline">Timeline</Label>
                <Input
                  id="timeline"
                  placeholder="E.g. 15 days"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full mt-4">
              {loading ? 'Creating...' : 'Create Tender'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}