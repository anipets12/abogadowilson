import { supabase } from '../config/supabase'

export const assetsService = {
	uploadImage: async (file: File, path: string) => {
		const { data, error } = await supabase.storage.from('assets').upload(`${path}/${file.name}`, file)
		if (error) throw error
		return data
	},
	getPublicUrl: (path: string) => {
		const { data } = supabase.storage.from('assets').getPublicUrl(path)
		return data.publicUrl
	}
}
