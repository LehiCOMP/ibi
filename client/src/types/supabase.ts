
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
          username: string
        }
      }
      events: {
        Row: {
          id: string
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
          id: string
          title: string
          content: string
          author_id: string
          created_at: string
        }
      }
      forum_topics: {
        Row: {
          id: string
          title: string
          content: string
          author_id: string
          created_at: string
          views: number
          reply_count: number
          last_reply_at: string | null
        }
      }
      forum_replies: {
        Row: {
          id: string
          topic_id: string
          content: string
          author_id: string
          created_at: string
        }
      }
    }
  }
}
