import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';
import { trackPremiumShown } from '../services/analyticsService';

interface PaywallBannerProps {
  source: string;
  onUpgrade: () => void;
}

export function PaywallBanner({ source, onUpgrade }: PaywallBannerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  React.useEffect(() => {
    trackPremiumShown(source);
  }, [source]);

  return (
    <>
      <TouchableOpacity style={styles.btn} onPress={() => setModalVisible(true)} activeOpacity={0.85}>
        <Text style={styles.btnText}>Liberar tudo — Premium</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={false} onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={styles.modal}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={styles.icon}>🌿</Text>
            <Text style={styles.modalTitle}>Desbloqueie o Sona completo</Text>
            <Text style={styles.modalSubtitle}>Tudo que você precisa para dormir melhor</Text>

            <View style={styles.benefits}>
              {[
                'Planos quinzenais renovados automaticamente',
                'Todas as meditações e sons exclusivos',
                'Insights personalizados diários',
                'Continua funcionando mesmo sem assinar — só restrito',
              ].map((b, i) => (
                <View key={i} style={styles.benefitRow}>
                  <Text style={styles.check}>✓</Text>
                  <Text style={styles.benefitText}>{b}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={[styles.planCard, styles.planCardActive]} activeOpacity={0.85} onPress={onUpgrade}>
              <View style={styles.planRow}>
                <Text style={styles.planTitle}>Anual</Text>
                <View style={styles.saveBadge}><Text style={styles.saveBadgeText}>Economize 58%</Text></View>
              </View>
              <Text style={styles.planPrice}>R$ 99,90<Text style={styles.planPer}> /ano</Text></Text>
              <Text style={styles.planSub}>R$ 8,32 / mês</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.planCard} activeOpacity={0.85} onPress={onUpgrade}>
              <Text style={styles.planTitle}>Mensal</Text>
              <Text style={styles.planPrice}>R$ 19,90<Text style={styles.planPer}> /mês</Text></Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ctaBtn} onPress={onUpgrade} activeOpacity={0.85}>
              <Text style={styles.ctaBtnText}>Assinar agora</Text>
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <TouchableOpacity><Text style={styles.footerLink}>Restaurar compra</Text></TouchableOpacity>
              <Text style={styles.footerDot}> · </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}><Text style={styles.footerLink}>Agora não</Text></TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor: colors.primary, borderRadius: radius.full, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm + 4, alignSelf: 'stretch', alignItems: 'center' },
  btnText: { ...typography.body, color: colors.textPrimary, fontWeight: '700' },
  modal: { flex: 1, backgroundColor: colors.bgBase },
  closeBtn: { alignSelf: 'flex-end', padding: spacing.lg },
  closeText: { ...typography.heading3, color: colors.textSecondary },
  content: { flex: 1, paddingHorizontal: spacing.xl, gap: spacing.md, alignItems: 'center' },
  icon: { fontSize: 48 },
  modalTitle: { ...typography.heading2, color: colors.textPrimary, textAlign: 'center' },
  modalSubtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  benefits: { alignSelf: 'stretch', gap: spacing.sm },
  benefitRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  check: { color: colors.teal, fontWeight: '700', fontSize: 16, marginTop: 2 },
  benefitText: { ...typography.body, color: colors.textSecondary, flex: 1 },
  planCard: { alignSelf: 'stretch', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: 4 },
  planCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryFaded },
  planRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planTitle: { ...typography.heading3, color: colors.textPrimary },
  saveBadge: { backgroundColor: '#F5A623', borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  saveBadgeText: { ...typography.label, color: '#fff', fontWeight: '700' },
  planPrice: { ...typography.heading2, color: colors.textPrimary },
  planPer: { ...typography.body, color: colors.textSecondary },
  planSub: { ...typography.label, color: colors.textMuted },
  ctaBtn: { alignSelf: 'stretch', backgroundColor: colors.primary, borderRadius: radius.full, paddingVertical: spacing.md, alignItems: 'center' },
  ctaBtnText: { ...typography.body, color: colors.textPrimary, fontWeight: '700' },
  footerRow: { flexDirection: 'row', alignItems: 'center' },
  footerLink: { ...typography.label, color: colors.textMuted },
  footerDot: { ...typography.label, color: colors.textMuted },
});
