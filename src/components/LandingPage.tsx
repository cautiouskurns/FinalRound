import React, { useState, useEffect, useRef, forwardRef } from 'react';
import styles from '../styles/LandingPage.module.css';
import CardDemo1 from './blocks/cards-demo-1';
import CardDemo3 from './blocks/cards-demo-3';
import { Carousel, Card, CarouselProps } from './ui/apple-cards-carousel';
import { CompareDemo } from './ui/compare-demo';

interface LandingPageProps {
  onGetStarted: () => void;
}

const ForwardedCarousel = forwardRef<unknown, CarouselProps>((props, ref) => <Carousel {...props} ref={ref} />);    

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [isClient, setIsClient] = useState(false);  
  const carouselRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);

    // Set up automatic cycling
    const interval = setInterval(() => {
      console.log('Interval triggered'); // Debug log
      if (carouselRef.current) {
        console.log('Carousel ref exists, calling next()'); // Debug log
        carouselRef.current.next();
      } else {
        console.log('Carousel ref is null or undefined'); // Debug log
      }
    }, 5000); // Change cards every 5 seconds

    return () => {
      console.log('Clearing interval'); // Debug log
      clearInterval(interval);
    };
  }, []);

  const carouselItems = [
    {
      src: "/path-to-image-1.jpg",
      title: "Ace Your Technical Interviews",
      category: "Interview Prep",
      content: <p>Detailed content about interview preparation...</p>,
    },
    {
      src: "/path-to-image-2.jpg",
      title: "Master Data Structures",
      category: "Algorithm Study",
      content: <p>In-depth content about data structures...</p>,
    },
    {
      src: "/path-to-image-3.jpg",
      title: "System Design Mastery",
      category: "Architecture",
      content: <p>Comprehensive guide to system design...</p>,
    },
    // Add more items as needed
  ];

  return (
    <div className={styles.landingPageWrapper}>
      {/* Hero Section */}
      <section className={`${styles.landingPage} flex flex-col md:flex-row items-center justify-between p-8 md:p-16 bg-[#1e2337] text-white`}>
        <div className={`${styles.content} max-w-xl md:w-1/2 mb-8 md:mb-0`}>
          <header className={styles.header}>
            {isClient && (
              <>
                <h2 className="text-xl font-semibold mb-4">Introducing FinalRound Pro</h2>
                <h1 className="text-5xl font-bold mb-6">
                  Supercharge your tech interview prep with FinalRound Pro
                </h1>
                <p className="text-xl mb-8">
                  Advanced analytics, personalized feedback, and more features to ace your technical interviews and land your dream job.
                </p>
                <button onClick={onGetStarted} className="bg-white text-[#1e2337] px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all">
                  Start your free trial
                </button>
              </>
            )}
          </header>
        </div>
        {isClient && (
          <div className="w-full md:w-1/2 h-[400px] relative overflow-hidden">
            <ForwardedCarousel
              ref={carouselRef}
              items={carouselItems.map((item, index) => (
                <Card key={index} card={item} index={index} layout={false} />
              ))}
            />
          </div>
        )}
      </section>

      {/* Profile Customizations Section */}
      <section className="flex flex-col md:flex-row items-center justify-between p-8 md:p-16 bg-gray-100">
        <div className="md:w-1/2 mb-8 md:mb-0 md:flex md:justify-end">
          <div className="md:w-4/5">
            <CardDemo1 />
          </div>
        </div>
        <div className="md:w-1/2 md:pl-16">
          <h3 className="text-[#1e2337] font-semibold mb-2">Profile Customizations</h3>
          <h2 className="text-4xl font-bold mb-6 text-[#1e2337]">Customize the look and feel of your FinalRound profile</h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-2 text-[#1e2337]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Profile sections to organize and categorize your projects
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-2 text-[#1e2337]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Customizable button to send your followers to any link
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-2 text-[#1e2337]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Dark profile theme
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-2 text-[#1e2337]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Ability to hide and show sections on your profile
            </li>
          </ul>
          <button onClick={onGetStarted} className="mt-8 bg-[#1e2337] text-white px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all">
            Start your free trial
          </button>
        </div>
      </section>

      {/* Advanced Analytics Section */}
      <section className="flex flex-col md:flex-row-reverse items-center justify-between p-8 md:p-16 bg-[#1e2337] text-white">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <CardDemo3 />
        </div>
        <div className="md:w-1/2 md:pr-16">
          <h3 className="font-semibold mb-2">Advanced Analytics</h3>
          <h2 className="text-4xl font-bold mb-6">Understand your audience better</h2>
          <ul className="space-y-4">
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              See who's appreciating and interacting with your work
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Understand your audience by geography
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Top search terms that lead to your projects
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Details on where your traffic is coming from
            </li>
          </ul>
          <button onClick={onGetStarted} className="mt-8 bg-white text-[#1e2337] px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all">
            Start your free trial
          </button>
        </div>
      </section>

      {/* New Compare Section */}
      <section className="flex flex-col md:flex-row items-center justify-between p-8 md:p-16 bg-gray-100">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <CompareDemo />
        </div>
        <div className="md:w-1/2 md:pl-16">
          <h3 className="text-[#1e2337] font-semibold mb-2">Visual Learning</h3>
          <h2 className="text-4xl font-bold mb-6 text-[#1e2337]">Compare and learn with interactive visuals</h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-2 text-[#1e2337]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Side-by-side comparisons of problem statements and solutions
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-2 text-[#1e2337]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Interactive hover feature to reveal solutions
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-2 text-[#1e2337]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Enhance understanding through visual learning techniques
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-2 text-[#1e2337]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Improve problem-solving skills with interactive examples
            </li>
          </ul>
          <button onClick={onGetStarted} className="mt-8 bg-[#1e2337] text-white px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all">
            Start your free trial
          </button>
        </div>
      </section>

      {isClient && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <div className="w-2 h-2 bg-[#1e2337] rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
