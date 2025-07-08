import React from 'react';
export default function Pagination({ pageInfo, onPage }) {
  const { page, totalPages } = pageInfo;
  return (
    <div>
      {[...Array(totalPages)].map((_, i) => (
        <button key={i} onClick={() => onPage(i+1)} disabled={i+1===page}>{i+1}</button>
      ))}
    </div>
  );
}