export type Video = {
  id: string
  title: string
  creator: string
  creatorId: string
  avatar: string
  category: string
  duration: string
  views: string
  postedAt: string
  likes: number
  comments: number
  thumbnail: string
  description: string
}

export const videos: Video[] = [
  {
    id: 'v1',
    title: '从零设计一个清爽的视频推荐流',
    creator: 'Omni 工作室',
    creatorId: 'omni',
    avatar: 'OM',
    category: '设计',
    duration: '12:48',
    views: '2.8 万',
    postedAt: '2 小时前',
    likes: 1840,
    comments: 126,
    thumbnail: 'linear-gradient(135deg, #0f172a 0%, #2563eb 55%, #a7f3d0 100%)',
    description: '从首页信息密度、视频卡片、推荐标签到创作者入口，快速拆解一个舒服的视频产品界面。',
  },
  {
    id: 'v2',
    title: '前端上传流程：封面、标签与发布状态',
    creator: '像素实验室',
    creatorId: 'pixel',
    avatar: 'PX',
    category: '编程',
    duration: '18:06',
    views: '6.3 万',
    postedAt: '昨天',
    likes: 5320,
    comments: 388,
    thumbnail: 'linear-gradient(135deg, #111827 0%, #7c3aed 46%, #f0abfc 100%)',
    description: '搭建一个完整的视频上传页：标题、简介、标签、封面预览和发布反馈都要顺手。',
  },
  {
    id: 'v3',
    title: '推荐卡片如何抓住用户注意力',
    creator: '信号研究所',
    creatorId: 'signal',
    avatar: 'SG',
    category: '产品',
    duration: '09:31',
    views: '1.4 万',
    postedAt: '3 天前',
    likes: 970,
    comments: 72,
    thumbnail: 'linear-gradient(135deg, #164e63 0%, #06b6d4 48%, #fde68a 100%)',
    description: '分析标题、封面、频道信息、时长标签和互动按钮在推荐系统中的作用。',
  },
  {
    id: 'v4',
    title: '创作者数据看板应该怎么做',
    creator: '北极星频道',
    creatorId: 'northstar',
    avatar: 'NS',
    category: '创作者',
    duration: '22:14',
    views: '9.1 万',
    postedAt: '1 周前',
    likes: 8430,
    comments: 641,
    thumbnail: 'linear-gradient(135deg, #1f2937 0%, #f97316 48%, #fef3c7 100%)',
    description: '用简洁的方式展示播放量、点赞、评论和上传表现，让创作者知道下一步该做什么。',
  },
  {
    id: 'v5',
    title: '更轻的视频互动：点赞、评论与收藏',
    creator: 'Human UI',
    creatorId: 'human-ui',
    avatar: 'HU',
    category: '界面',
    duration: '15:22',
    views: '3.7 万',
    postedAt: '5 天前',
    likes: 2760,
    comments: 214,
    thumbnail: 'linear-gradient(135deg, #0f766e 0%, #22c55e 46%, #ecfccb 100%)',
    description: '让互动功能足够明显，但不喧宾夺主，视频内容仍然是页面的中心。',
  },
  {
    id: 'v6',
    title: '视频平台的搜索和个人主页路由设计',
    creator: '路由工坊',
    creatorId: 'routes',
    avatar: 'RT',
    category: '架构',
    duration: '11:05',
    views: '1.9 万',
    postedAt: '今天',
    likes: 1180,
    comments: 93,
    thumbnail: 'linear-gradient(135deg, #312e81 0%, #4f46e5 44%, #c4b5fd 100%)',
    description: '用 Vue Router 拆分首页、播放页、上传页、个人主页和资料页。',
  },
]

export const categories = ['全部', '设计', '编程', '产品', '创作者', '界面', '架构']
