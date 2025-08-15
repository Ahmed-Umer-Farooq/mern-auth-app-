import React from 'react';

const Sidebar = ({ friends, selectedUser, setSelectedUser, onlineMap, search, setSearch, friendRequests, onAccept, onDecline, onSendRequest }) => {
  return (
    <aside className="w-1/4 min-w-[250px] bg-white border-r chat-sidebar flex flex-col">
      {/* Search bar */}
      <div className="p-3 border-b sticky top-0 bg-white z-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Search friends or users..."
            className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>

      {/* Friend Requests */}
      {friendRequests && friendRequests.length > 0 && (
        <div className="p-2 border-b bg-gray-50">
          <div className="flex justify-between items-center p-2">
            <h2 className="font-semibold text-gray-600">Friend Requests</h2>
          </div>
          {friendRequests.map(req => (
            <div key={req._id} className="flex items-center justify-between p-2 bg-white rounded shadow mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">
                  {req.sender.avatar || req.sender.name.charAt(0)}
                </div>
                <span className="font-medium text-gray-700">{req.sender.name}</span>
              </div>
              <div className="flex gap-1">
                <button className="bg-green-500 text-white px-2 py-1 rounded text-xs" onClick={() => onAccept(req._id)}>Accept</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded text-xs" onClick={() => onDecline(req._id)}>Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Contacts */}
      <div className="p-2">
        <div className="flex justify-between items-center p-2">
          <h2 className="font-semibold text-gray-600">Active Contacts</h2>
          {/* Add friend button (optional) */}
          <button className="text-blue-500 hover:bg-blue-50 p-1 rounded" onClick={onSendRequest}>
            <i className="fas fa-edit"></i>
          </button>
        </div>
        <div>
          {friends.length === 0 && <div className="p-4 text-gray-400">No friends found</div>}
          {friends.map(user => (
            <div
              key={user._id}
              className={`contact-item p-2 flex items-center cursor-pointer mb-1 ${selectedUser && selectedUser._id === user._id ? 'active' : ''}`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="relative mr-3">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <span>{user.avatar || user.name.charAt(0)}</span>
                </div>
                <div className={`status-indicator ${onlineMap[user._id] ? 'status-online' : 'status-offline'}`}></div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium">{user.name}</span>
                  {/* Optionally show last message time */}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 truncate">{user.lastMessage || ''}</span>
                  {/* Optionally show unread badge */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 