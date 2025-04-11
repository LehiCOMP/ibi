
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          display_name: string
          avatar_url: string
        }
      }
      events: {
        Row: {
          id: number
          title: string
          description: string
          start_time: string
          end_time: string
          category: string
          created_at: string
        }
      }
      bible_studies: {
        Row: {
          id: number
          title: string
          content: string
          author_id: string
          created_at: string
        }
      }
      // Adicione outras tabelas conforme necessário
    }
  }
}
