import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, fontSizes } from '@/shared/theme';
import { AppText, Screen, Input } from '@/shared/ui';
import { deriveTeamsFromTitle } from '@/shared/utils';
import { useAuth } from '@/features/auth/ui/hooks/useAuth';
import { useBattlesStore } from '@/features/battles/data/store/battles.store';
import type { OutcomeType } from '@/shared/types';
import { useCreateBattle } from '@/features/battles/data/mutations/useCreateBattle';
import type { CreateBattleScreenProps, DropdownOption } from '@/shared/types';

export default function CreateBattleScreen({ navigation, route }: CreateBattleScreenProps) {
  const { user } = useAuth();

  const { prefillTitle, prefillEventId, prefillDescription, homeTeam, awayTeam, visibility } =
    route?.params || {};

  const title = useBattlesStore((s) => s.title);
  const eventId = useBattlesStore((s) => s.eventId);
  const stake = useBattlesStore((s) => s.stake);
  const selectedTeam = useBattlesStore((s) => s.selectedTeam);
  const selectedOutcome = useBattlesStore((s) => s.selectedOutcome);
  const showTeamPicker = useBattlesStore((s) => s.showTeamPicker);
  const showOutcomePicker = useBattlesStore((s) => s.showOutcomePicker);
  const setTitle = useBattlesStore((s) => s.setTitle);
  const setEventId = useBattlesStore((s) => s.setEventId);
  const setStake = useBattlesStore((s) => s.setStake);
  const setSelectedTeam = useBattlesStore((s) => s.setSelectedTeam);
  const setSelectedOutcome = useBattlesStore((s) => s.setSelectedOutcome);
  const setShowTeamPicker = useBattlesStore((s) => s.setShowTeamPicker);
  const setShowOutcomePicker = useBattlesStore((s) => s.setShowOutcomePicker);
  const initCreateBattle = useBattlesStore((s) => s.initCreateBattle);

  const createMutation = useCreateBattle();
  const createLoading = createMutation.isPending;

  useEffect(() => {
    initCreateBattle({ title: prefillTitle, eventId: prefillEventId });
  }, [prefillTitle, prefillEventId]);

  const { home: derivedHome, away: derivedAway } = deriveTeamsFromTitle(prefillTitle);
  const finalHomeTeam = homeTeam || derivedHome;
  const finalAwayTeam = awayTeam || derivedAway;

  const teamOptions: DropdownOption[] =
    finalHomeTeam && finalAwayTeam
      ? [
          { label: finalHomeTeam, value: 'home' },
          { label: finalAwayTeam, value: 'away' },
        ]
      : [];

  const outcomeOptions: DropdownOption[] = [
    { label: 'Will Win', value: 'WIN' },
    { label: 'Will Lose', value: 'LOSE' },
  ];

  const getSelectedTeamLabel = () => {
    if (!selectedTeam) return 'Select Team';
    const option = teamOptions.find((o) => o.value === selectedTeam);
    return option?.label || 'Select Team';
  };

  const getSelectedOutcomeLabel = () => {
    if (!selectedOutcome) return 'Select Outcome';
    const option = outcomeOptions.find((o) => o.value === selectedOutcome);
    return option?.label || 'Select Outcome';
  };

  const generateBattleDescription = () => {
    if (selectedTeam && selectedOutcome && teamOptions.length > 0) {
      const teamName = teamOptions.find((o) => o.value === selectedTeam)?.label;
      const outcome = selectedOutcome === 'WIN' ? 'will win' : 'will lose';
      return `I predict ${teamName} ${outcome}`;
    }
    return '';
  };

  const getCreatorWinningTeam = () => {
    if (!selectedTeam || !selectedOutcome || !finalHomeTeam || !finalAwayTeam) return undefined;
    const pickedHome = selectedTeam === 'home';
    const willWin = selectedOutcome === 'WIN';
    if (pickedHome && willWin) return finalHomeTeam;
    if (pickedHome && !willWin) return finalAwayTeam;
    if (!pickedHome && willWin) return finalAwayTeam;
    if (!pickedHome && !willWin) return finalHomeTeam;
    return undefined;
  };

  const onCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a battle title');
      return;
    }

    if (teamOptions.length > 0 && !selectedTeam) {
      Alert.alert('Error', 'Please select a team');
      return;
    }

    if (teamOptions.length > 0 && !selectedOutcome) {
      Alert.alert('Error', 'Please select an outcome');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a battle');
      return;
    }

    const description = generateBattleDescription();
    const creatorPickTeam = getCreatorWinningTeam();

    const { error } = await createMutation.mutateAsync({
      creatorId: user.id,
      title: title.trim(),
      description: description || undefined,
      eventId: eventId.trim() || undefined,
      stake: parseInt(stake) || 0,
      creatorPick: creatorPickTeam,
      visibility: visibility || 'public',
    });

    if (error) {
      Alert.alert('Failed', error.message);
      return;
    }

    navigation.goBack();
  };

  const DropdownModal = ({
    visible,
    onClose,
    options,
    onSelect,
    title: modalTitle,
  }: {
    visible: boolean;
    onClose: () => void;
    options: DropdownOption[];
    onSelect: (value: string) => void;
    title: string;
  }) => (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent}>
          <AppText variant="h4" style={styles.modalTitle}>{modalTitle}</AppText>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.modalOption}
              onPress={() => {
                onSelect(option.value);
                onClose();
              }}
            >
              <AppText variant="body2" style={{ textAlign: 'center' }}>{option.label}</AppText>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <Screen padding={0}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <AppText variant="h4">Create Battle</AppText>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.form}>
          <Input
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Chiefs vs Bills - Who wins?"
            placeholderTextColor={colors.textSecondary}
            maxLength={100}
            required
            containerStyle={styles.inputGroup}
            inputTextStyle={styles.inputFont}
          />

          {teamOptions.length > 0 && (
            <View style={styles.inputGroup}>
              <AppText variant="label" style={styles.label}>Battle Setup</AppText>
              <AppText variant="helper" color={colors.textSecondary} style={styles.setupHint}>Select your prediction for this game</AppText>

              <View style={styles.dropdownRow}>
                <TouchableOpacity style={styles.dropdown} onPress={() => setShowTeamPicker(true)}>
                  <AppText variant="body2" color={selectedTeam ? colors.text : colors.textSecondary}>
                    {getSelectedTeamLabel()}
                  </AppText>
                  <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowOutcomePicker(true)}
                >
                  <AppText variant="body2" color={selectedOutcome ? colors.text : colors.textSecondary}>
                    {getSelectedOutcomeLabel()}
                  </AppText>
                  <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {selectedTeam && selectedOutcome && (
                <View style={styles.predictionPreview}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                  <AppText variant="body2" style={{ flex: 1 }}>{generateBattleDescription()}</AppText>
                </View>
              )}
            </View>
          )}

          <View style={styles.inputGroup}>
            <Input
              label="Game/Event ID"
              value={eventId}
              onChangeText={setEventId}
              placeholder="Sports event ID"
              placeholderTextColor={colors.textSecondary}
              editable={!prefillEventId}
              wrapperStyle={eventId ? styles.inputDisabled : undefined}
              inputTextStyle={styles.inputFont}
            />
            {eventId ? <AppText variant="helper" color={colors.textSecondary} style={styles.hint}>Linked to live game data</AppText> : null}
          </View>

          <View style={styles.inputGroup}>
            <Input
              label="Stake (BC)"
              value={stake}
              onChangeText={(text) => setStake(text.replace(/[^0-9]/g, ''))}
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              inputTextStyle={styles.inputFont}
            />
            <AppText variant="helper" color={colors.textSecondary} style={styles.hint}>Battle Coins to wager (optional)</AppText>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.createButton, createLoading && styles.createButtonDisabled]}
          onPress={onCreate}
          disabled={createLoading}
        >
          {createLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Ionicons name="flash" size={20} color={colors.white} />
              <AppText variant="buttonMd" color={colors.white}>Create Battle</AppText>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      <DropdownModal
        visible={showTeamPicker}
        onClose={() => setShowTeamPicker(false)}
        options={teamOptions}
        onSelect={(value) => setSelectedTeam(value)}
        title="Select Team"
      />

      <DropdownModal
        visible={showOutcomePicker}
        onClose={() => setShowOutcomePicker(false)}
        options={outcomeOptions}
        onSelect={(value) => setSelectedOutcome(value as OutcomeType)}
        title="Select Outcome"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
  form: {
    marginTop: spacing[4],
  },
  inputGroup: {
    marginBottom: spacing[4] * 1.5,
  },
  label: {
    marginBottom: spacing[2],
  },
  inputFont: {
    fontSize: fontSizes.sm,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  hint: {
    marginTop: spacing[2] / 2,
  },
  setupHint: {
    marginBottom: spacing[4],
  },
  inputDisabled: {
    opacity: 0.7,
  },
  dropdownRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  dropdown: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: radii.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  predictionPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[4],
    backgroundColor: colors.primaryTint,
    padding: spacing[4],
    borderRadius: radii.lg,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing[4],
    borderRadius: radii.lg,
    marginTop: spacing[4],
    marginBottom: spacing[4] * 2,
    gap: spacing[2],
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlayHeavy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    marginBottom: spacing[4],
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
});
