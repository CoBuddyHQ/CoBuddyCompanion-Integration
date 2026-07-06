/**
 * CoBuddy Companion App - Support Stack (CPN-166 to CPN-174)
 */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SupportStackParamList} from '../../types/navigation.types';
import {Routes} from '../routes';
import {defaultStackScreenOptions} from '../navigatorOptions';
import SupportCenterScreen from '../../screens/support/SupportCenterScreen';
import CreateSupportTicketScreen from '../../screens/support/CreateSupportTicketScreen';
import SupportTicketDetailScreen from '../../screens/support/SupportTicketDetailScreen';
import LiveSupportChatScreen from '../../screens/support/LiveSupportChatScreen';
import HelpArticleScreen from '../../screens/support/HelpArticleScreen';
import DisputeCenterScreen from '../../screens/support/DisputeCenterScreen';
import DisputeDetailScreen from '../../screens/support/DisputeDetailScreen';
import AppealDecisionScreen from '../../screens/support/AppealDecisionScreen';

const Stack = createStackNavigator<SupportStackParamList>();

const SupportStack: React.FC = () => (
  <Stack.Navigator screenOptions={defaultStackScreenOptions}>
    <Stack.Screen name={Routes.SUPPORT_CENTER} component={SupportCenterScreen} />
    <Stack.Screen name={Routes.CREATE_SUPPORT_TICKET} component={CreateSupportTicketScreen} />
    <Stack.Screen name={Routes.SUPPORT_TICKET_DETAIL} component={SupportTicketDetailScreen} />
    <Stack.Screen name={Routes.LIVE_SUPPORT_CHAT} component={LiveSupportChatScreen} />
    <Stack.Screen name={Routes.HELP_ARTICLE} component={HelpArticleScreen} />
    <Stack.Screen name={Routes.DISPUTE_CENTER} component={DisputeCenterScreen} />
    <Stack.Screen name={Routes.DISPUTE_DETAIL} component={DisputeDetailScreen} />
    <Stack.Screen name={Routes.APPEAL_DECISION} component={AppealDecisionScreen} />
  </Stack.Navigator>
);

export default SupportStack;
