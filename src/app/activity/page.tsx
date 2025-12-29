"use client";

import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { apiCall } from '../../lib/api';

interface Activity {
    _id: string;
    action: string;
    details: string;
    createdAt: string;
}

export default function ActivityLog() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const data = await apiCall('/activity', 'GET', null, token);
                    setActivities(data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };
        fetchActivity();
    }, []);

    return (
        <div className="min-h-screen bg-[url('/bg-abstract.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
            <Navbar />

            <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-white mb-8">Activity Log</h1>

                <div className="glass p-6 rounded-2xl animate-fade-in-up">
                    {isLoading ? (
                        <div className="text-center text-gray-400 py-4">Loading activities...</div>
                    ) : activities.length === 0 ? (
                        <div className="text-center text-gray-400 py-4">No activity recorded yet.</div>
                    ) : (
                        <div className="space-y-6">
                            {activities.map((activity) => (
                                <div key={activity._id} className="flex items-start gap-4 pb-6 border-b border-border last:border-0 last:pb-0">
                                    <div className={`mt-1 w-2 h-2 rounded-full ${activity.action === 'Login' ? 'bg-green-500' :
                                            activity.action === 'Register' ? 'bg-purple-500' :
                                                'bg-blue-500'
                                        }`} />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-white font-medium">{activity.action}</h3>
                                            <span className="text-xs text-gray-500">{new Date(activity.createdAt).toLocaleString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-400">{activity.details}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
