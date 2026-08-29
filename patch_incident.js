const fs = require('fs');

let txt = fs.readFileSync('src/screens/safety/IncidentReportScreen.tsx', 'utf8');

// Imports
txt = txt.replace(
  "import {useSafetyStore} from '../../store/slices/safetyStore';",
  "import {useSafetyStore} from '../../store/slices/safetyStore';\nimport { SafetyService } from '../../services/api/services';\nimport { pickMedia } from '../../utils/mediaPicker';"
);

// State & handleAddEvidence
txt = txt.replace(
  "const [when,         setWhen]         = useState('');",
  "const [when,         setWhen]         = useState('');\n  const [evidenceFiles, setEvidenceFiles] = useState<any[]>([]);\n\n  const handleAddEvidence = async () => {\n    Alert.alert(\n      t('safety.add_evidence'),\n      t('alerts.choose_how_you_want_to_upload'),\n      [\n        {\n          text: t('alerts.camera'),\n          onPress: async () => {\n            const result = await pickMedia('camera', { mediaType: 'photo' });\n            if (result) setEvidenceFiles(prev => [...prev, result]);\n          },\n        },\n        {\n          text: t('alerts.gallery'),\n          onPress: async () => {\n            const result = await pickMedia('gallery', { mediaType: 'photo' });\n            if (result) setEvidenceFiles(prev => [...prev, result]);\n          },\n        },\n        { text: t('common.cancel'), style: 'cancel' }\n      ]\n    );\n  };"
);

// handleSubmit
txt = txt.replace(
  "const handleSubmit = () => {\n    if (!canSubmit) {return;}\n    fileIncident(sessionId.trim() || null, incidentType, description.trim())\n      .then(() => navigation.navigate(Routes.INCIDENT_SUBMITTED, {type: 'incident'}))\n      .catch((e: Error) => Alert.alert('Error', e.message));\n  };",
  "const handleSubmit = async () => {\n    if (!canSubmit) {return;}\n    try {\n      const reportId = await fileIncident(sessionId.trim() || null, incidentType, description.trim());\n      if (reportId && evidenceFiles.length > 0) {\n        const formData = new FormData();\n        evidenceFiles.forEach((file) => {\n          formData.append('evidence', {\n            uri: file.uri,\n            type: file.type || 'image/jpeg',\n            name: file.name || `evidence_${Date.now()}.jpg`,\n          } as any);\n        });\n        try {\n          await SafetyService.addIncidentEvidence(reportId, formData);\n        } catch (evidenceError) {\n          console.warn('Failed to upload evidence, but incident was submitted', evidenceError);\n        }\n      }\n      navigation.navigate(Routes.INCIDENT_SUBMITTED, {type: 'incident'});\n    } catch (e: any) {\n      Alert.alert('Error', e.message);\n    }\n  };"
);

// UI replacement
txt = txt.replace(
  "<TouchableOpacity accessibilityRole=\"button\" style={s.attachRow}\n            onPress={() => navigation.navigate(Routes.INCIDENT_EVIDENCE_UPLOAD, {incidentId: `draft-${Math.random().toString(36).substring(2, 9)}`})}\n            activeOpacity={0.75}>\n            <Icon name=\"attach-file\" size={18} color={colors.gold} />\n            <Text style={s.attachText}> {t('safety.attach_evidence')} </Text>\n            <Icon name=\"chevron-right\" size={18} color={colors.textMuted} />\n          </TouchableOpacity>",
  "<TouchableOpacity accessibilityRole=\"button\" style={s.attachRow}\n            onPress={handleAddEvidence}\n            activeOpacity={0.75}>\n            <Icon name=\"attach-file\" size={18} color={colors.gold} />\n            <Text style={s.attachText}> {t('safety.attach_evidence')} {evidenceFiles.length > 0 ? `(${evidenceFiles.length})` : ''} </Text>\n            <Icon name=\"chevron-right\" size={18} color={colors.textMuted} />\n          </TouchableOpacity>"
);

fs.writeFileSync('src/screens/safety/IncidentReportScreen.tsx', txt, { encoding: 'utf8' });
