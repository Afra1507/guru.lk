import React, { useEffect, useState } from 'react';
import { Table, Badge } from 'react-bootstrap';
import { fetchAllDownloads } from '../../services/adminService';

const DownloadsMonitor = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDownloads = async () => {
      try {
        const { data } = await fetchAllDownloads();
        setDownloads(data);
      } finally {
        setLoading(false);
      }
    };
    loadDownloads();
  }, []);

  if (loading) return <p>Loading downloads...</p>;

  return (
    <div className="mt-4">
      <h4>Recent Downloads</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>User</th>
            <th>Lesson</th>
            <th>Downloaded At</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {downloads.map(download => (
            <tr key={download.downloadId}>
              <td>User #{download.userId}</td>
              <td>{download.lesson.title}</td>
              <td>{new Date(download.downloadedAt).toLocaleString()}</td>
              <td>
                <Badge 
                  bg={new Date(download.expiresAt) > new Date() ? 'success' : 'secondary'}
                >
                  {new Date(download.expiresAt) > new Date() ? 'Active' : 'Expired'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DownloadsMonitor;