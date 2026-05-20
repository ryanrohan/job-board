'use client';

import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client/core';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const GET_LISTINGS = gql`
  query {
    listings {
      id title company location salary description
      employer { email }
      applications { id }
    }
  }
`;

const CREATE_LISTING = gql`
  mutation CreateListing($title: String!, $company: String!, $location: String!, $description: String!, $salary: Int) {
    createListing(title: $title, company: $company, location: $location, description: $description, salary: $salary) {
      id title
    }
  }
`;

const APPLY = gql`
  mutation Apply($listingId: Int!) {
    applyToListing(listingId: $listingId) { id }
  }
`;

export default function Home() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { data, refetch } = useQuery<{ listings: any[] }>(GET_LISTINGS);
  const [createListing] = useMutation(CREATE_LISTING);
  const [apply] = useMutation(APPLY);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', company: '', location: '', description: '', salary: '' });

  const handleCreate = async () => {
    await createListing({
      variables: {
        ...form,
        salary: form.salary ? parseInt(form.salary) : null
      }
    });
    setShowForm(false);
    setForm({ title: '', company: '', location: '', description: '', salary: '' });
    refetch();
  };

  const handleApply = async (listingId: number) => {
    await apply({ variables: { listingId } });
    refetch();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Job Board</h1>
        <div className="flex gap-3 items-center">
          {user ? (
            <>
              <span className="text-gray-500 text-sm">{user.email}</span>
              {user.role === 'EMPLOYER' && (
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => setShowForm(!showForm)}
                >
                  Post a job
                </button>
              )}
              <button
                className="border px-4 py-2 rounded hover:bg-gray-50"
                onClick={() => { logout(); router.push('/auth'); }}
              >
                Log out
              </button>
            </>
          ) : (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => router.push('/auth')}
            >
              Log in
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Post a new job</h2>
          {['title', 'company', 'location', 'description', 'salary'].map(field => (
            <input
              key={field}
              className="w-full border rounded p-2 mb-3"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={(form as any)[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
            />
          ))}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleCreate}
          >
            Post job
          </button>
        </div>
      )}

      <div className="space-y-4">
        {data?.listings.map((listing: any) => (
          <div key={listing.id} className="bg-white border rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{listing.title}</h2>
                <p className="text-gray-500">{listing.company} · {listing.location}</p>
                {listing.salary && (
                  <p className="text-green-600 font-medium mt-1">${listing.salary.toLocaleString()}/yr</p>
                )}
                <p className="text-gray-700 mt-2">{listing.description}</p>
                <p className="text-gray-400 text-sm mt-2">{listing.applications.length} applicant(s)</p>
              </div>
              {user?.role === 'APPLICANT' && (
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ml-4 shrink-0"
                  onClick={() => handleApply(listing.id)}
                >
                  Apply
                </button>
              )}
            </div>
          </div>
        ))}
        {data?.listings.length === 0 && (
          <p className="text-center text-gray-400 py-12">No jobs posted yet.</p>
        )}
      </div>
    </div>
  );
}
