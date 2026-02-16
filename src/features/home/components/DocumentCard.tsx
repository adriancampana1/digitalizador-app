import { AppContainer } from '@/components/layout/AppContainer';
import { AppText } from '@/components/layout/AppText';

export type DocumentCardProps = {
  documentName: string;
  provider: string;
  documentSize: string;
  uploadDate: string;
};

const DocumentCard = ({
  documentName,
  provider,
  documentSize,
  uploadDate,
}: DocumentCardProps) => {
  return (
    <AppContainer>
      <AppText>{documentName}</AppText>
      <AppText>{provider}</AppText>
      <AppText>{documentSize}</AppText>
      <AppText>{uploadDate}</AppText>
    </AppContainer>
  );
};

export default DocumentCard;
