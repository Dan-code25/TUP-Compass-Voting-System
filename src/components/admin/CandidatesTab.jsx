import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Upload, Trash2 } from "lucide-react";
import { POSITIONS } from "../../lib/constants";

export default function CandidatesTab({ candidates, refreshData }) {
  const [form, setForm] = useState({
    name: "",
    position: POSITIONS[0],
    platform: "",
    achievements: "",
  });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isViewing, setIsViewing] = useState(false);
  const [viewCandidate, setViewCandidate] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      let photoUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name}`;
      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;
        const { error: uploadError } = await supabase.storage
          .from("candidates")
          .upload(filePath, selectedFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("candidates")
          .getPublicUrl(filePath);
        photoUrl = urlData.publicUrl;
      }
      const achievementsArray = form.achievements
        .split("\n")
        .map((a) => a.trim())
        .filter((a) => a.length > 0);
      const payload = {
        name: form.name,
        position: form.position,
        platform: form.platform,
        photo_url: photoUrl,
        organization: "TUPM COMPASS",
        achievements: achievementsArray,
      };
      const { error } = await supabase.from("candidates").insert(payload);
      if (error) throw error;

      await refreshData();
      setForm({
        name: "",
        position: POSITIONS[0],
        platform: "",
        achievements: "",
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      alert("Candidate added successfully!");
    } catch (error) {
      alert("Error adding candidate: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete candidate?")) return;
    await supabase.from("candidates").delete().eq("id", id);
    await refreshData();
  };

  const handleView = (c) => {
    setViewCandidate(c);
    setIsViewing(true);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#22162E]">Manage Candidates</h2>
      <div className="bg-white p-6 rounded-xl border shadow-sm border-[#B3A3DB]">
        <form
          onSubmit={handleAdd}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="md:col-span-2 border-2 border-dashed border-[#B3A3DB] rounded-lg p-6 flex flex-col items-center justify-center bg-[#F4F5F4] relative hover:bg-[#EFD8ED] transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center w-full"
            >
              {previewUrl ? (
                <div className="flex flex-col items-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md mb-3"
                  />
                  <span className="text-sm font-bold text-[#759CE6]">
                    Click to change photo
                  </span>
                </div>
              ) : (
                <>
                  <Upload className="text-[#887AB8] mb-2 w-10 h-10" />
                  <span className="text-sm font-bold text-[#433A58]">
                    Click to upload photo
                  </span>
                </>
              )}
            </label>
          </div>
          <input
            placeholder="Full Name"
            required
            className="border p-2 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <select
            className="border p-2 rounded"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
          >
            {POSITIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            placeholder="Platform"
            required
            className="col-span-1 md:col-span-2 border p-2 rounded"
            value={form.platform}
            onChange={(e) => setForm({ ...form, platform: e.target.value })}
          />
          <textarea
            placeholder="Achievements (one per line)"
            className="col-span-1 md:col-span-2 border p-2 rounded h-24"
            value={form.achievements}
            onChange={(e) => setForm({ ...form, achievements: e.target.value })}
          />
          <button
            type="submit"
            disabled={uploading}
            className="col-span-1 md:col-span-2 bg-[#759CE6] text-white py-2 rounded font-bold hover:bg-[#887AB8] disabled:bg-[#B3A3DB] transition-colors cursor-pointer"
          >
            {uploading ? "Uploading..." : "Add Candidate"}
          </button>
        </form>
      </div>

      {isViewing && viewCandidate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsViewing(false)}
              className="absolute top-4 right-4 text-[#B3A3DB] hover:text-[#433A58] text-xl font-bold"
            >
              ✕
            </button>
            <div className="flex flex-col items-center text-center mb-6">
              <img
                src={viewCandidate.photo_url}
                className="w-32 h-32 rounded-full bg-[#EFD8ED] mb-4 border-4 border-[#F4F5F4] shadow-md object-cover"
              />
              <h3 className="text-2xl font-bold text-[#22162E]">
                {viewCandidate.name}
              </h3>
              <p className="text-[#433A58] font-medium">
                {viewCandidate.position}
              </p>
            </div>
            <div className="space-y-4 text-left border-t border-[#F4F5F4] pt-4">
              <div>
                <h4 className="font-bold text-[#22162E] text-sm uppercase tracking-wide mb-1">
                  Platform
                </h4>
                <p className="text-[#626672] text-sm leading-relaxed">
                  {viewCandidate.platform}
                </p>
              </div>
              <div>
                <h4 className="font-bold text-[#22162E] text-sm uppercase tracking-wide mb-1">
                  Achievements
                </h4>
                <ul className="text-sm text-[#626672] list-disc list-inside space-y-1">
                  {viewCandidate.achievements?.length > 0 ? (
                    viewCandidate.achievements.map((ach, i) => (
                      <li key={i}>{ach}</li>
                    ))
                  ) : (
                    <li className="italic text-[#B3A3DB]">None</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border shadow-sm border-[#B3A3DB] overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#EFD8ED] border-b border-[#B3A3DB]">
            <tr>
              <th className="p-4 text-[#433A58] font-bold">Name</th>
              <th className="p-4 text-[#433A58] font-bold">Position</th>
              <th className="p-4 text-right text-[#433A58] font-bold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr
                key={c.id}
                className="border-b border-[#F4F5F4] hover:bg-[#F4F5F4] transition-colors"
              >
                <td className="p-4 font-medium flex items-center gap-3">
                  <img
                    src={c.photo_url}
                    alt={c.name}
                    className="w-10 h-10 rounded-full object-cover bg-[#EFD8ED] border border-[#B3A3DB]"
                  />
                  {c.name}
                </td>
                <td className="p-4 text-[#626672]">{c.position}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end items-center gap-3">
                    <button
                      onClick={() => handleView(c)}
                      className="text-[#759CE6] hover:text-[#887AB8] font-medium text-xs uppercase tracking-wide"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-[#626672] hover:text-[#22162E] transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {candidates.length === 0 && (
              <tr>
                <td colSpan="3" className="p-8 text-center text-[#626672]">
                  No candidates found. Add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
