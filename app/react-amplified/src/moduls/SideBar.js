import React from 'react';
import {Navigation} from '@shopify/polaris';
import {ChatMajor, ClockMajor, CustomerPlusMajor, CustomersMajor, HomeMajor, ListMajor, LiveViewMajor, OrdersMajor, PageMajor, ProductsMajor, ProfileMajor, PromoteMinor, RefundMajor, SendMajor} from '@shopify/polaris-icons';


export default function SideBar() {
  return(
    <Navigation location="/">
      <Navigation.Section
        items={[
          {
            url: '/top',
            label: 'ダッシュボード',
            icon: HomeMajor,
          },
          {
            url: "/line_api/callback",
            label: "LINE通知テスト用",
            icon: SendMajor,
          }
        ]}
      />
      <Navigation.Section separator items={[]} />
      <strong style={{margin: "0 0.8rem", padding: "0 0.8rem", color: "#00b901"}}>友達管理</strong>

      <Navigation.Section
        items={[
          {
            url: '/followers',
            label: '友達リスト',
            icon: ListMajor,
          },
          {
            url: '/path/to/place',
            label: '友達追加',
            icon: CustomerPlusMajor,
          },
          {
            url: '/path/to/place',
            label: '個別トーク',
            icon: ChatMajor,
          },
        ]}
      />
      <Navigation.Section separator items={[]} />
      <strong style={{margin: "0 0.8rem", padding: "0 0.8rem", color: "#00b901"}}>通知管理</strong>
      <Navigation.Section
        items={[
          {
            url: '/path/to/place',
            label: 'ステップ配信管理',
            icon: SendMajor,
          },
          {
            url: '/path/to/place',
            label: '商品一覧',
            icon: ProductsMajor,
          },
          {
            url: '/path/to/place',
            label: '友達追加時配信',
            icon: CustomerPlusMajor,
          },
          {
            url: '/path/to/place',
            label: '配信予約',
            icon: ClockMajor,
          },
          {
            url: '/path/to/place',
            label: '一斉配信',
            icon: RefundMajor,
          },
          {
            url: '/path/to/place',
            label: 'タイムライン投稿',
            icon: PageMajor,
          },
          {
            url: '/path/to/place',
            label: 'メディア管理',
            icon: LiveViewMajor,
          }
        ]}
      />
      <Navigation.Section separator items={[]} />
      <strong style={{margin: "0 0.8rem", padding: "0 0.8rem", color: "#00b901"}}>アカウント管理</strong>
      <Navigation.Section
        items={[
          {
            url: '/my_page',
            label: 'マイアカウント',
            icon: ProfileMajor,
          },
          {
            url: '/path/to/place',
            label: 'LINE公式アカウント',
            icon: PromoteMinor,
          },
          {
            url: '/path/to/place',
            label: 'スタッフ登録',
            icon: CustomersMajor,
          }
        ]}
      />
  </Navigation>
  );

}
