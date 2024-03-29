import Head from 'next/head';
import styles from '../styles/Home.module.css';
import LoginForm from '../src/components/LoginForm';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.container}>
      <LoginForm />
    </div>
  );
}
