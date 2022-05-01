import { ReactNode, useState } from 'react'
import { IconBaseProps } from 'react-icons'

import Card from '../../components/Card'
import { Container } from './styles'

interface TabsProps {
  name: string
  icon: React.ComponentType<IconBaseProps>
  children: ReactNode
}

const Tabs: React.FC<{ tabs: TabsProps[] }> = ({ tabs }) => {
  const [selectedTab, setSelectedTab] = useState(0)
  return (
    <>
      <Container>
        {tabs.map((tab, index) => (
          <span key={index}>
            <input
              defaultChecked={selectedTab === index}
              type="radio"
              id={'tab' + index + '_' + tab.name.replace(' ', '_')}
              name="tabs"
              onChange={() => setSelectedTab(index)}
            />
            <label htmlFor={'tab' + index + '_' + tab.name.replace(' ', '_')}>
              <tab.icon size={18} />
              <span className="hide-md-down">{tab.name}</span>
            </label>
          </span>
        ))}
      </Container>
      <Card>{tabs[selectedTab]?.children}</Card>
    </>
  )
}

export default Tabs
