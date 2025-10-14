import ReactMarkdown from 'react-markdown';
import { rulesMarkdownData } from '@/lib/data';
import styles from './page.module.css';

export default function RulesPage() {
  return (
    <div className={styles.page}>
      <h1>League Charter</h1>
      <ReactMarkdown className={styles.markdown}>{rulesMarkdownData}</ReactMarkdown>
    </div>
  );
}
