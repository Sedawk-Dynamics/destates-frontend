"use client";

import { useEffect, useState } from "react";
import { ContactInquiry } from "@/types";
import { getAdminInquiries } from "@/lib/api";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    getAdminInquiries().then((r) => setInquiries(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Contact Inquiries</h1>

      {loading ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">Loading...</div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Subject</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {inquiries.map((inq) => (
                  <>
                    <tr key={inq.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium text-foreground">{inq.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{inq.email}</td>
                      <td className="px-4 py-3 text-muted-foreground">{inq.subject}</td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(inq.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setExpandedId(expandedId === inq.id ? null : inq.id)}
                          className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                        >
                          {expandedId === inq.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </button>
                      </td>
                    </tr>
                    {expandedId === inq.id && (
                      <tr key={`${inq.id}-detail`}>
                        <td colSpan={5} className="px-4 py-4 bg-muted/30">
                          <div className="space-y-1">
                            {inq.phone && <p className="text-sm"><span className="font-medium text-foreground">Phone:</span> <span className="text-muted-foreground">{inq.phone}</span></p>}
                            <p className="text-sm"><span className="font-medium text-foreground">Message:</span></p>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{inq.message}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
                {inquiries.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No inquiries found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
