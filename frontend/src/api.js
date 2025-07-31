const flask = "http://127.0.0.1:5000";          

// export async function api(path, opts = {}) {
//   const token = localStorage.getItem("token");
//   const headers = { "Content-Type": "application/json", ...opts.headers };
//   if (token) headers.Authorization = `Bearer ${token}`;

//   const res   = await fetch(`${flask}${path}`, { ...opts, headers });
//   const data  = res.status === 204 ? null : await res.json();
//   if (!res.ok) throw new Error(data?.error || res.statusText);
//   return data;
// }


export async function api(path, opts = {}) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", ...opts.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  console.log("API Request:", { path, body: opts.body, headers });

  const res = await fetch(`${flask}${path}`, { ...opts, headers });
  const data = res.status === 204 ? null : await res.json();
  
  console.log("API Response:", { status: res.status, data });
  
  if (!res.ok) throw new Error(data?.error || res.statusText);
  return data;
}