describe('react-card-gen', () => {
  it('should log "Hello from react-card-gen"', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    require('./react-card-gen');
    expect(consoleSpy).toHaveBeenCalledWith('Hello from react-card-gen');
    consoleSpy.mockRestore();
  });
});