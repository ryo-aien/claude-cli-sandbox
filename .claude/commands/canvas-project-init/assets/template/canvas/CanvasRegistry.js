// ============================================================
// CANVAS REGISTRY
// カード種別（type文字列）とコンポーネントのマッピングテーブル。
// 新カードを追加するときは import + registerCard の2行だけ追加する。
// ============================================================

import LoadingCard     from '../components/LoadingCard';
import IdeaCard        from '../components/cards/IdeaCard';
import PersonaCard     from '../components/cards/PersonaCard';
import PropositionCard from '../components/cards/PropositionCard';
import InterviewCard   from '../components/cards/InterviewCard';
import NamingSelect    from '../components/cards/NamingSelect';
import ClusterChart    from '../components/cards/ClusterChart';
import BannerGrid      from '../components/cards/BannerGrid';
import CMStoryboard    from '../components/cards/CMStoryboard';
import AgentList       from '../components/cards/AgentList';
// import MyNewCard    from '../components/cards/MyNewCard'; // ← 追加例

const registry = new Map();

export function registerCard(type, Component) {
  registry.set(type, Component);
}

export function getCard(type) {
  return registry.get(type) ?? null;
}

// ---- 既存カード登録（変更不要） ----
registerCard('loading',          LoadingCard);
registerCard('idea',             IdeaCard);
registerCard('persona',          PersonaCard);
registerCard('proposition',      PropositionCard);
registerCard('interview_result', InterviewCard);
registerCard('naming_select',    NamingSelect);
registerCard('cluster_chart',    ClusterChart);
registerCard('banner_grid',      BannerGrid);
registerCard('cm_storyboard',    CMStoryboard);
registerCard('agent_list',       AgentList);

// ---- プロジェクト固有カード登録 ----
// registerCard('my_new_card', MyNewCard);
