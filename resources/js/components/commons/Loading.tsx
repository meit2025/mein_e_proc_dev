import loadingData from '../../../assets/loading/loading.gif';

interface LoadingProps {
  isLoading: boolean;
}

export const Loading = ({ isLoading }: LoadingProps) => {
  return (
    isLoading && (
      <div id='busy-overlay' className='busy-overlay'>
        <div className='spinner'>
          <img src={loadingData} width='75px' height='75px' alt='loading' />
        </div>
      </div>
    )
  );
};
