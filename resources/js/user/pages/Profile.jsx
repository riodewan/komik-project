import { useEffect, useState } from "react";
import axios from "../../axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast, { Toaster } from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', username: '', bio: '', avatar: null });
  const [passwords, setPasswords] = useState({ current_password: '', new_password: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/user', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const u = res.data.user || res.data;
      setUser(u);
      setForm({
        name: u.name || '',
        email: u.email || '',
        username: u.username || '',
        bio: u.bio || '',
        avatar: u.avatar || null
      });
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = e => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    setSaving(true);
    const token = localStorage.getItem('token');

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('username', form.username);
      formData.append('bio', form.bio);
      if (form.avatar instanceof File) {
        formData.append('avatar', form.avatar);
      }

      const res = await axios.post('/api/user?_method=PUT', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      setUser(res.data.user);
      setEditing(false);
      toast.success('✅ Profil berhasil diperbarui');
    } catch (err) {
      console.error(err);
      toast.error('❌ Gagal menyimpan profil');
    } finally {
      setSaving(false);
    }
  };

  const updatePassword = async () => {
    setSaving(true);
    const token = localStorage.getItem('token');
    try {
      await axios.put('/api/user/password', passwords, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('✅ Password berhasil diganti!');
      setPasswords({ current_password: '', new_password: '' });
      setChangingPass(false);
    } catch (err) {
      console.error(err);
      toast.error('❌ Gagal mengganti password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white p-6">⏳ Memuat profil...</div>;

  return (
    <div className="bg-gray-950 text-white min-h-screen flex flex-col">
      <Toaster position="top-right" />
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10 flex-1">
        <h1 className="text-3xl font-bold mb-6">👤 Profil Pengguna</h1>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-400">Foto Profil</label>
              {editing ? (
                <div className="flex items-center gap-4 mt-1">
                  {form.avatar ? (
                    <img
                      src={typeof form.avatar === 'string' ? `/storage/${form.avatar}` : URL.createObjectURL(form.avatar)}
                      className="w-16 h-16 rounded-full object-cover"
                      alt="Preview"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-700 rounded-full" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) setForm({ ...form, avatar: file });
                    }}
                    className="text-sm"
                  />
                </div>
              ) : (
                <img
                  src={user.avatar ? `/storage/${user.avatar}` : '/default-avatar.png'}
                  className="w-16 h-16 rounded-full object-cover mt-2"
                  alt="Avatar"
                />
              )}
            </div>
            <div>
              <label className="text-sm text-gray-400">Nama</label>
              {editing ? (
                <input name="name" value={form.name} onChange={handleChange} className="w-full mt-1 bg-gray-800 border border-gray-600 rounded px-4 py-2" />
              ) : (
                <p className="text-lg font-medium">{user.name}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-400">Username</label>
              {editing ? (
                <input name="username" value={form.username} onChange={handleChange} className="w-full mt-1 bg-gray-800 border border-gray-600 rounded px-4 py-2" />
              ) : (
                <p className="text-lg">{user.username || '-'}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-400">Email</label>
              {editing ? (
                <input name="email" value={form.email} onChange={handleChange} className="w-full mt-1 bg-gray-800 border border-gray-600 rounded px-4 py-2" />
              ) : (
                <p className="text-lg">{user.email}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-400">Role</label>
              <p className="text-lg capitalize">{user.role}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-400">Bio</label>
              {editing ? (
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} className="w-full mt-1 bg-gray-800 border border-gray-600 rounded px-4 py-2"></textarea>
              ) : (
                <p className="text-sm text-gray-300">{user.bio || '-'}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            {editing ? (
              <>
                <button onClick={() => setEditing(false)} className="px-4 py-2 rounded border border-gray-600">Batal</button>
                <button onClick={saveProfile} disabled={saving} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded">
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded">Edit Profil</button>
            )}
          </div>
        </div>

        <div className="mt-8 bg-gray-900 rounded-xl p-6 border border-gray-800 shadow">
          <h2 className="text-xl font-bold mb-4">🔐 Ganti Password</h2>
          {changingPass ? (
            <div className="space-y-4">
              <input name="current_password" type="password" value={passwords.current_password} onChange={handlePasswordChange} placeholder="Password saat ini" className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-2" />
              <input name="new_password" type="password" value={passwords.new_password} onChange={handlePasswordChange} placeholder="Password baru" className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-2" />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setChangingPass(false)} className="px-4 py-2 border border-gray-600 rounded">Batal</button>
                <button onClick={updatePassword} disabled={saving} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded">{saving ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setChangingPass(true)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded">Ubah Password</button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
