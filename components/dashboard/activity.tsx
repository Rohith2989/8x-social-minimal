'use client';

import { RasterButton } from './raster-button';
import { Icon } from './ui';

export function Activity({ read, onRead, onSelect, onAll, expanded = false }: { read: boolean; onRead: () => void; onSelect: (index: number) => void; onAll?: () => void; expanded?: boolean }) {
  return <div className="ds-activity">
    {!expanded && <><div className="ds-activity-top"><span>{read ? 'UP TO DATE' : '03 NEW'}</span><RasterButton onClick={onRead}>{read ? 'All read' : 'Mark all read'}</RasterButton></div><h2>Activity</h2></>}
    <div className="ds-activity-list">{[['posts', 'September report is ready', '2 hours ago'], ['creators', '4 creators joined your network', 'Yesterday'], ['send', 'Your content plan is shared', '2 days ago']].map(([icon, title, time], i) => <RasterButton key={title} className="ds-activity-row" onClick={() => onSelect(i)}><span className="ds-activity-symbol"><Icon name={icon} size={20} /></span><span><strong>{title}</strong><small>{time}</small></span>{!read && <i className="ds-activity-unread" aria-label="Unread" />}</RasterButton>)}</div>
    {!expanded && <RasterButton className="ds-activity-all" onClick={onAll}><span>View all activity</span><span className="ds-popup-arrow"><Icon name="arrow" size={20} /></span></RasterButton>}
    {expanded && <p className="ds-panel-note">You’re all caught up. This is the activity for your demo workspace.</p>}
  </div>;
}
