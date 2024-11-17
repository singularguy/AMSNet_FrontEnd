import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, theme } from 'antd';
import React from 'react';

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: string;
  href: string;
}> = ({ title, href, index, desc }) => {
  const { useToken } = theme;

  const { token } = useToken();

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            lineHeight: '22px',
            backgroundSize: '100%',
            textAlign: 'center',
            padding: '8px 16px 16px 12px',
            color: '#FFF',
            fontWeight: 'bold',
          }}
        >
          {index}
        </div>
        <div
          style={{
            fontSize: '16px',
            color: token.colorText,
            paddingBottom: 8,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontSize: '14px',
          color: token.colorTextSecondary,
          textAlign: 'justify',
          lineHeight: '22px',
          marginBottom: 8,
        }}
      >
        {desc}
      </div>
      <a href={href} target="_blank" rel="noreferrer">
        了解更多 {'>'}
      </a>
    </div>
  );
};

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
        bodyStyle={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
          }}
        >
          <div
            style={{
              fontSize: '20px',
              color: token.colorTextHeading,
            }}
          >
            欢迎使用AMSNet
          </div>
          <p
            style={{
              fontSize: '14px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 32,
              width: '65%',
            }}
          >
            AMSNet是宁波东方理工研究院在电路研究领域的重要成果，是用于模拟/混合信号（AMS）电路的网表数据集。它通过自动技术将电路图转换为网表，为电路设计提供关键数据支持，以解决多模态大语言模型（MLLM）在自动生成AMS电路时缺乏全面数据集的问题。

            数据集包含晶体管级电路图和SPICE格式网表，其规模和电路复杂性正在快速扩展，还计划纳入晶体管尺寸和性能规格等信息。同时也在探索功能宏识别（如检测LDO、ADC、DAC、PLL等）来丰富功能，提高电路设计效率。
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <InfoCard
              index={1}
              href="https://ams-net.github.io/"
              title="了解AMSNet数据集"
              desc="包含晶体管级电路图和SPICE网表，为电路设计提供数据支持。"
            />
            <InfoCard
              index={2}
              href="https://your-link-2.com"
              title="AMSNet的功能扩展"
              desc="正在快速扩展规模和复杂性，计划纳入晶体管尺寸和性能规格，探索功能宏识别。"
            />
            <InfoCard
              index={3}
              href="https://your-link-3.com"
              title="AMSNet在电路设计中的应用"
              desc="促进MLLM在AMS电路设计中的应用探索，为电路设计提供高效支持。"
            />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
