import React, { useState, useEffect } from "react";
import { exportReportsToExcel, exportPRLRatingsToExcel } from "../utils/excelExport";
import API_BASE_URL from '../config/api';
import "./ProgramLeader.css";

export default function ProgramLeader({ user }) {
  const [activeTab, setActiveTab] = useState("monitoring");
  const [reports, setReports] = useState([]);
  const [prlRatings, setPrlRatings] = useState([]);
  const [lecturerRatings, setLecturerRatings] = useState([]);
  const [streams, setStreams] = useState([]);
  const [modules, setModules] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Module assignment states
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState("");

  // Stream/Module management states
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [editingStream, setEditingStream] = useState(null);
  const [editingModule, setEditingModule] = useState(null);
  const [streamForm, setStreamForm] = useState({ name: "" });
  const [moduleForm, setModuleForm] = useState({ name: "", code: "", stream_id: "" });

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.token}`
  });

  // Fetch initial data
  useEffect(() => {
    fetchStreams();
    fetchModules();
    fetchLecturers();
  }, []);

  useEffect(() => {
    if (activeTab === "reports") {
      fetchReports();
    } else if (activeTab === "prl-ratings") {
      fetchPRLRatings();
    } else if (activeTab === "lecturer-ratings") {
      fetchLecturerRatings();
    } else if (activeTab === "management") {
      fetchStreams();
      fetchModules();
    }
  }, [activeTab]);

  const fetchStreams = async () => {
    try {
      const res = await fetch(API_BASE_URL + "/api/pl/streams", {
        headers: authHeaders()
      });
      const data = await res.json();
      setStreams(data.streams || []);
    } catch (err) {
      console.error("Error fetching streams:", err);
    }
  };

  const fetchModules = async () => {
    try {
      const res = await fetch(API_BASE_URL + "/api/pl/modules", {
        headers: authHeaders()
      });
      const data = await res.json();
      setModules(data.modules || []);
    } catch (err) {
      console.error("Error fetching modules:", err);
    }
  };

  const fetchLecturers = async () => {
    try {
      const res = await fetch(API_BASE_URL + "/api/pl/lecturers", {
        headers: authHeaders()
      });
      const data = await res.json();
      setLecturers(data.lecturers || []);
    } catch (err) {
      console.error("Error fetching lecturers:", err);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await fetch(API_BASE_URL + "/api/reports", {
        headers: authHeaders()
      });
      const data = await res.json();
      setReports(data.reports || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setReports([]);
    }
  };

  const fetchPRLRatings = async () => {
    try {
      const res = await fetch(API_BASE_URL + "/api/ratings/pl/prls", {
        headers: authHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setPrlRatings(data.ratings || []);
      }
    } catch (err) {
      console.error("Error fetching PRL ratings:", err);
      setPrlRatings([]);
    }
  };

  const fetchLecturerRatings = async () => {
    try {
      const res = await fetch(API_BASE_URL + "/api/pl/lecturer-ratings", {
        headers: authHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setLecturerRatings(data.ratings || []);
      }
    } catch (err) {
      console.error("Error fetching lecturer ratings:", err);
      setLecturerRatings([]);
    }
  };

  // Stream Management Functions
  const handleCreateStream = async () => {
    if (!streamForm.name.trim()) {
      setError("Stream name is required");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      const res = await fetch(API_BASE_URL + "/api/pl/streams", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(streamForm)
      });

      const data = await res.json();
      
      if (data.success) {
        setMsg("Stream created successfully");
        setShowStreamModal(false);
        setStreamForm({ name: "" });
        fetchStreams();
        setTimeout(() => setMsg(""), 3000);
      } else {
        setError(data.message || "Failed to create stream");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error("Error creating stream:", err);
      setError("Error creating stream");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleUpdateStream = async () => {
    if (!streamForm.name.trim()) {
      setError("Stream name is required");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      const res = await fetch(API_BASE_URL + `/api/pl/streams/${editingStream.id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(streamForm)
      });

      const data = await res.json();
      
      if (data.success) {
        setMsg("Stream updated successfully");
        setShowStreamModal(false);
        setEditingStream(null);
        setStreamForm({ name: "" });
        fetchStreams();
        setTimeout(() => setMsg(""), 3000);
      } else {
        setError(data.message || "Failed to update stream");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error("Error updating stream:", err);
      setError("Error updating stream");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDeleteStream = async (id) => {
    if (!window.confirm("Are you sure you want to delete this stream?")) return;

    try {
      const res = await fetch(API_BASE_URL + `/api/pl/streams/${id}`, {
        method: "DELETE",
        headers: authHeaders()
      });

      const data = await res.json();
      
      if (data.success) {
        setMsg("Stream deleted successfully");
        fetchStreams();
        setTimeout(() => setMsg(""), 3000);
      } else {
        setError(data.message || "Failed to delete stream");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error("Error deleting stream:", err);
      setError("Error deleting stream");
      setTimeout(() => setError(""), 3000);
    }
  };

  // Module Management Functions
  const handleCreateModule = async () => {
    if (!moduleForm.name.trim() || !moduleForm.code.trim() || !moduleForm.stream_id) {
      setError("All fields are required");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      const res = await fetch(API_BASE_URL + "/api/pl/modules", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(moduleForm)
      });

      const data = await res.json();
      
      if (data.success) {
        setMsg("Module created successfully");
        setShowModuleModal(false);
        setModuleForm({ name: "", code: "", stream_id: "" });
        fetchModules();
        setTimeout(() => setMsg(""), 3000);
      } else {
        setError(data.message || "Failed to create module");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error("Error creating module:", err);
      setError("Error creating module");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleUpdateModule = async () => {
    if (!moduleForm.name.trim() || !moduleForm.code.trim() || !moduleForm.stream_id) {
      setError("All fields are required");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      const res = await fetch(API_BASE_URL + `/api/pl/modules/${editingModule.id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(moduleForm)
      });

      const data = await res.json();
      
      if (data.success) {
        setMsg("Module updated successfully");
        setShowModuleModal(false);
        setEditingModule(null);
        setModuleForm({ name: "", code: "", stream_id: "" });
        fetchModules();
        setTimeout(() => setMsg(""), 3000);
      } else {
        setError(data.message || "Failed to update module");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error("Error updating module:", err);
      setError("Error updating module");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDeleteModule = async (id) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;

    try {
      const res = await fetch(API_BASE_URL + `/api/pl/modules/${id}`, {
        method: "DELETE",
        headers: authHeaders()
      });

      const data = await res.json();
      
      if (data.success) {
        setMsg("Module deleted successfully");
        fetchModules();
        setTimeout(() => setMsg(""), 3000);
      } else {
        setError(data.message || "Failed to delete module");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error("Error deleting module:", err);
      setError("Error deleting module");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleAssignModule = async () => {
    if (!selectedLecturer || !selectedModuleId) {
      setError("Please select a module");
      return;
    }

    try {
      const res = await fetch(API_BASE_URL + "/api/pl/assign-module", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          lecturer_id: selectedLecturer.id,
          module_id: selectedModuleId
        })
      });

      const data = await res.json();
      
      if (data.success) {
        setMsg(`Module successfully assigned to ${selectedLecturer.name} ${selectedLecturer.surname}`);
        setShowAssignModal(false);
        setSelectedLecturer(null);
        setSelectedModuleId("");
        fetchLecturers();
        setTimeout(() => setMsg(""), 3000);
      } else {
        setError(data.message || "Failed to assign module");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error("Error assigning module:", err);
      setError("Error assigning module");
      setTimeout(() => setError(""), 3000);
    }
  };

  const openAssignModal = (lecturer) => {
    setSelectedLecturer(lecturer);
    setSelectedModuleId("");
    setShowAssignModal(true);
  };

  const openStreamModal = (stream = null) => {
    if (stream) {
      setEditingStream(stream);
      setStreamForm({ name: stream.name });
    } else {
      setEditingStream(null);
      setStreamForm({ name: "" });
    }
    setShowStreamModal(true);
  };

  const openModuleModal = (module = null) => {
    if (module) {
      setEditingModule(module);
      setModuleForm({ 
        name: module.name, 
        code: module.code, 
        stream_id: module.stream_id 
      });
    } else {
      setEditingModule(null);
      setModuleForm({ name: "", code: "", stream_id: "" });
    }
    setShowModuleModal(true);
  };

  const handleExportReports = () => {
    if (filteredReports.length === 0) {
      alert("No reports to export");
      return;
    }
    exportReportsToExcel(filteredReports);
  };

  const handleExportPRLRatings = () => {
    if (prlRatings.length === 0) {
      alert("No PRL ratings to export");
      return;
    }
    exportPRLRatingsToExcel(prlRatings);
  };

  const filteredReports = reports.filter(r => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      r.facultyname?.toLowerCase().includes(search) ||
      r.lecturername?.toLowerCase().includes(search) ||
      r.coursename?.toLowerCase().includes(search) ||
      r.topic?.toLowerCase().includes(search) ||
      r.feedback?.toLowerCase().includes(search)
    );
  });

  const filteredPRLRatings = prlRatings.filter(prl => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      prl.prl_name?.toLowerCase().includes(search) ||
      prl.prl_surname?.toLowerCase().includes(search) ||
      prl.stream_name?.toLowerCase().includes(search)
    );
  });

  const filteredLecturerRatings = lecturerRatings.filter(l => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      l.lecturer_name?.toLowerCase().includes(search) ||
      l.lecturer_surname?.toLowerCase().includes(search) ||
      l.stream_name?.toLowerCase().includes(search)
    );
  });

  const filteredLecturers = lecturers.filter(l => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      l.name?.toLowerCase().includes(search) ||
      l.surname?.toLowerCase().includes(search) ||
      l.username?.toLowerCase().includes(search) ||
      l.stream_name?.toLowerCase().includes(search)
    );
  });

  const filteredStreams = streams.filter(s => {
    if (!searchTerm) return true;
    return s.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredModules = modules.filter(m => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      m.name?.toLowerCase().includes(search) ||
      m.code?.toLowerCase().includes(search) ||
      m.stream_name?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="page-container">
      <h1>Program Leader Portal</h1>
      <div className="welcome-section">
        <div>
          <p className="welcome-text">
            Welcome, <span>{user.username}</span>
            <span className="role">Program Leader</span>
          </p>
        </div>
      </div>
      {msg && <p className="success-message">{msg}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'monitoring' ? 'active' : ''}`}
          onClick={() => setActiveTab('monitoring')}
        >
          Monitoring
        </button>
        <button 
          className={`tab ${activeTab === 'management' ? 'active' : ''}`}
          onClick={() => setActiveTab('management')}
        >
          Management
        </button>
        <button 
          className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          PRL Reports
        </button>
        <button 
          className={`tab ${activeTab === 'classes' ? 'active' : ''}`}
          onClick={() => setActiveTab('classes')}
        >
          Classes & Modules
        </button>
        <button 
          className={`tab ${activeTab === 'lecturers' ? 'active' : ''}`}
          onClick={() => setActiveTab('lecturers')}
        >
          Lecturers
        </button>
        <button 
          className={`tab ${activeTab === 'prl-ratings' ? 'active' : ''}`}
          onClick={() => setActiveTab('prl-ratings')}
        >
          PRL Ratings
        </button>
        <button 
          className={`tab ${activeTab === 'lecturer-ratings' ? 'active' : ''}`}
          onClick={() => setActiveTab('lecturer-ratings')}
        >
          Lecturer Ratings
        </button>
      </div>

      {activeTab === "management" && (
        <div className="management-section">
          <h2>Streams & Modules Management</h2>
          
          {/* Streams Section */}
          <div className="management-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Streams</h3>
              <button
                onClick={() => openStreamModal()}
                style={{
                  background: '#4CAF50',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                + Add Stream
              </button>
            </div>

            <input
              type="text"
              placeholder="Search streams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '1rem'
              }}
            />

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Modules</th>
                  <th>Lecturers</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStreams.length === 0 ? (
                  <tr>
                    <td colSpan="4">No streams found</td>
                  </tr>
                ) : (
                  filteredStreams.map(stream => (
                    <tr key={stream.id}>
                      <td><strong>{stream.name}</strong></td>
                      <td>{stream.module_count || 0}</td>
                      <td>{stream.lecturer_count || 0}</td>
                      <td>
                        <button
                          onClick={() => openStreamModal(stream)}
                          style={{
                            background: '#2196F3',
                            color: 'white',
                            padding: '6px 12px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginRight: '8px'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStream(stream.id)}
                          style={{
                            background: '#f44336',
                            color: 'white',
                            padding: '6px 12px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Modules Section */}
          <div className="management-card" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Modules</h3>
              <button
                onClick={() => openModuleModal()}
                style={{
                  background: '#4CAF50',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                + Add Module
              </button>
            </div>

            <input
              type="text"
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '1rem'
              }}
            />

            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Stream</th>
                  <th>Assigned Lecturers</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredModules.length === 0 ? (
                  <tr>
                    <td colSpan="5">No modules found</td>
                  </tr>
                ) : (
                  filteredModules.map(module => (
                    <tr key={module.id}>
                      <td><strong>{module.code}</strong></td>
                      <td>{module.name}</td>
                      <td>{module.stream_name}</td>
                      <td>{module.assigned_lecturers || 0}</td>
                      <td>
                        <button
                          onClick={() => openModuleModal(module)}
                          style={{
                            background: '#2196F3',
                            color: 'white',
                            padding: '6px 12px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginRight: '8px'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteModule(module.id)}
                          style={{
                            background: '#f44336',
                            color: 'white',
                            padding: '6px 12px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "monitoring" && (
        <div className="monitoring-section">
          <h2>System Monitoring Overview</h2>
          <div className="monitoring-grid">
            <div className="monitor-card">
              <h3>Total Streams</h3>
              <div className="monitor-value">{streams.length}</div>
            </div>
            <div className="monitor-card">
              <h3>Total Modules</h3>
              <div className="monitor-value">{modules.length}</div>
            </div>
            <div className="monitor-card">
              <h3>Total Lecturers</h3>
              <div className="monitor-value">{lecturers.length}</div>
            </div>
            <div className="monitor-card">
              <h3>Total Reports</h3>
              <div className="monitor-value">{reports.length}</div>
            </div>
          </div>

          <h3>Streams Overview</h3>
          <div className="streams-overview">
            {streams.map(stream => {
              const streamModules = modules.filter(m => m.stream_id === stream.id);
              return (
                <div key={stream.id} className="stream-card">
                  <h4>{stream.name}</h4>
                  <p><strong>Modules:</strong> {streamModules.length}</p>
                  <div className="module-list">
                    {streamModules.map(m => (
                      <span key={m.id} className="module-tag">
                        {m.code}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="reports-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Reports from Principal Lecturers</h2>
            <button 
              onClick={handleExportReports}
              style={{ 
                background: '#4CAF50', 
                color: 'white', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
            📥 Export to Excel
            </button>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Search by faculty, lecturer, course, topic, or feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '1rem'
              }}
            />
          </div>

          {filteredReports.length === 0 ? (
            <p>No reports found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Faculty</th>
                  <th>Lecturer</th>
                  <th>Course</th>
                  <th>Topic</th>
                  <th>Students</th>
                  <th>Feedback</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map(r => (
                  <tr key={r.id}>
                    <td>{r.dateoflecture}</td>
                    <td>{r.facultyname}</td>
                    <td>{r.lecturername}</td>
                    <td>{r.coursename}</td>
                    <td>{r.topic}</td>
                    <td>{r.actualstudents}/{r.totalstudents}</td>
                    <td>{r.feedback || '-'}</td>
                    <td>{new Date(r.submitted_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "classes" && (
        <div className="classes-section">
          <h2>All Streams & Modules</h2>
          {streams.map(stream => {
            const streamModules = modules.filter(m => m.stream_id === stream.id);
            return (
              <div key={stream.id} className="class-details-card">
                <h3>{stream.name}</h3>
                <div className="modules-grid">
                  {streamModules.map(module => (
                    <div key={module.id} className="module-card">
                      <h4>{module.code}</h4>
                      <p>{module.name}</p>
                    </div>
                  ))}
                </div>
                {streamModules.length === 0 && (
                  <p className="no-data">No modules assigned to this stream</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "lecturers" && (
        <div className="lecturers-section">
          <h2>All Lecturers</h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Search by name, username, or stream..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '1rem'
              }}
            />
          </div>

          {filteredLecturers.length === 0 ? (
            <p>No lecturers found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Stream</th>
                  <th>Module</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLecturers.map(l => (
                  <tr key={l.id}>
                    <td>{l.name} {l.surname}</td>
                    <td>{l.username}</td>
                    <td>{l.stream_name || '-'}</td>
                    <td>{l.module_name || 'Not assigned'}</td>
                    <td>
                      <span className={`role-badge ${l.role}`}>
                        {l.role === 'prl' ? 'Principal Lecturer' : 
                         l.role === 'pl' ? 'Program Leader' : 'Lecturer'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => openAssignModal(l)}
                        style={{
                          background: '#2196F3',
                          color: 'white',
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        Assign Module
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "prl-ratings" && (
        <div className="prl-ratings-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Principal Lecturer Ratings (from Lecturers)</h2>
            <button 
              onClick={handleExportPRLRatings}
              style={{ 
                background: '#4CAF50', 
                color: 'white', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Export to Excel
            </button>
          </div>

          <p className="info-note">
            Ratings submitted by lecturers evaluating their Principal Lecturers' performance.
          </p>

          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Search by PRL name or stream..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '1rem'
              }}
            />
          </div>

          {filteredPRLRatings.length === 0 ? (
            <p>No PRL ratings found.</p>
          ) : (
            <div className="summary-grid">
              {filteredPRLRatings.map((prl) => (
                <div key={prl.prl_id} className="summary-card">
                  <h4>{prl.prl_name} {prl.prl_surname}</h4>
                  <p><strong>Stream:</strong> {prl.stream_name}</p>
                  <p className="rating-score">
                    <strong>Average Rating:</strong>
                    <span className={`rating ${
                      prl.average_rating >= 4 ? 'excellent' :
                      prl.average_rating >= 3 ? 'good' :
                      prl.average_rating >= 2 ? 'fair' : 'poor'
                    }`}>
                      {prl.average_rating ? parseFloat(prl.average_rating).toFixed(2) : 'N/A'} / 5
                    </span>
                  </p>
                  <p><strong>Total Ratings:</strong> {prl.total_ratings || 0}</p>
                  
                  {prl.ratings && prl.ratings.length > 0 && (
                    <div className="recent-feedback">
                      <h5>Recent Feedback:</h5>
                      {prl.ratings.slice(0, 3).map((rating, idx) => (
                        <div key={idx} className="feedback-item">
                          <div className="feedback-header">
                            <span className="rating-value">{rating.rating}/5</span>
                            <span className="feedback-date">
                              {new Date(rating.submitted_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="feedback-comment">{rating.comments}</p>
                          <small>- {rating.lecturer_name}</small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "lecturer-ratings" && (
        <div className="lecturer-ratings-section">
          <h2>Lecturer Ratings (from Students)</h2>
          <p className="info-note">
            Overview of all lecturer ratings submitted by students across all streams.
          </p>

          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Search by lecturer name or stream..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '1rem'
              }}
            />
          </div>

          {filteredLecturerRatings.length === 0 ? (
            <p>No lecturer ratings found.</p>
          ) : (
            <div className="ratings-overview">
              {filteredLecturerRatings.map((lecturer) => (
                <div key={lecturer.lecturer_id} className="lecturer-rating-card">
                  <h4>{lecturer.lecturer_name} {lecturer.lecturer_surname}</h4>
                  <p><strong>Stream:</strong> {lecturer.stream_name}</p>
                  <div className="rating-stats">
                    <div className="stat">
                      <label>Average Rating:</label>
                      <span className={`rating ${
                        lecturer.average_rating >= 4 ? 'excellent' :
                        lecturer.average_rating >= 3 ? 'good' :
                        lecturer.average_rating >= 2 ? 'fair' : 'poor'
                      }`}>
                        {lecturer.average_rating ? parseFloat(lecturer.average_rating).toFixed(2) : 'N/A'} / 5
                      </span>
                    </div>
                    <div className="stat">
                      <label>Total Ratings:</label>
                      <span>{lecturer.total_ratings || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stream Modal */}
      {showStreamModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ marginTop: 0, color: '#fff' }}>
              {editingStream ? 'Edit Stream' : 'Add New Stream'}
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff' }}>
                Stream Name:
              </label>
              <input
                type="text"
                value={streamForm.name}
                onChange={(e) => setStreamForm({ name: e.target.value })}
                placeholder="e.g., Information Systems"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowStreamModal(false);
                  setEditingStream(null);
                  setStreamForm({ name: '' });
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'transparent',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={editingStream ? handleUpdateStream : handleCreateStream}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#4CAF50',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {editingStream ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Module Modal */}
      {showModuleModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ marginTop: 0, color: '#fff' }}>
              {editingModule ? 'Edit Module' : 'Add New Module'}
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff' }}>
                Module Code:
              </label>
              <input
                type="text"
                value={moduleForm.code}
                onChange={(e) => setModuleForm({...moduleForm, code: e.target.value})}
                placeholder="e.g., IS301"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff' }}>
                Module Name:
              </label>
              <input
                type="text"
                value={moduleForm.name}
                onChange={(e) => setModuleForm({...moduleForm, name: e.target.value})}
                placeholder="e.g., Database Management Systems"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff' }}>
                Stream:
              </label>
              <select
                value={moduleForm.stream_id}
                onChange={(e) => setModuleForm({...moduleForm, stream_id: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select a stream...</option>
                {streams.map(stream => (
                  <option key={stream.id} value={stream.id}>
                    {stream.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowModuleModal(false);
                  setEditingModule(null);
                  setModuleForm({ name: '', code: '', stream_id: '' });
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'transparent',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={editingModule ? handleUpdateModule : handleCreateModule}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#4CAF50',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {editingModule ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Module Assignment Modal */}
      {showAssignModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ marginTop: 0, color: '#fff' }}>
              Assign Module to {selectedLecturer?.name} {selectedLecturer?.surname}
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff' }}>
                Select Module:
              </label>
              <select
                value={selectedModuleId}
                onChange={(e) => setSelectedModuleId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '1rem'
                }}
              >
                <option value="">Choose a module...</option>
                {modules
                  .filter(m => m.stream_id === selectedLecturer?.stream_id)
                  .map(module => (
                    <option key={module.id} value={module.id}>
                      {module.code} - {module.name}
                    </option>
                  ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedLecturer(null);
                  setSelectedModuleId("");
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'transparent',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAssignModule}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#4CAF50',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Assign Module
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
