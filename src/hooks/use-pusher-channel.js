import { useEffect } from 'react';
import { pusherClient } from '@/lib/pusher';

export function usePusherChannel(channelName, events) {
    useEffect(() => {
        if (!channelName) return;

        const channel = pusherClient.subscribe(channelName);

        for (const [event, handler] of Object.entries(events)) {
            channel.bind(event, handler);
        }

        return () => {
            for (const [event, handler] of Object.entries(events)) {
                channel.unbind(event, handler);
            }
            pusherClient.unsubscribe(channelName);
        };
    }, [channelName, events]);
}
